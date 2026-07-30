import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { analyzeResumeWithAi } from '../services/aiService.js';

export const createApplication = async (req, res) => {
  try {
    const { jobId, resumeURL, aiAnalysis } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existing = await Application.findOne({ applicantId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already applied to this job' });
    }

    const analysis = aiAnalysis || (resumeURL ? await analyzeResumeWithAi(resumeURL, job.description, req.user.name) : null);

    const application = await Application.create({
      applicantId: req.user._id,
      jobId,
      resumeURL: resumeURL || '',
      aiScore: analysis?.matchScore || 0,
      aiSummary: analysis?.summary || '',
      status: 'applied',
    });

    await Notification.create({
      userId: job.recruiterId,
      userModel: 'Recruiter',
      message: `New application received for ${job.title}`,
      type: 'application',
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const query = req.user.role === 'recruiter'
      ? { jobId: { $in: await Job.find({ recruiterId: req.user._id }).select('_id') } }
      : { applicantId: req.user._id };

    const applications = await Application.find(query)
      .populate('jobId', 'title company location')
      .populate('applicantId', 'name email phone skills');

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId', 'recruiterId title');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedStatuses = ['applied', 'screening', 'interview', 'offered', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      userId: application.applicantId,
      userModel: 'Applicant',
      message: `Your application for ${application.jobId.title} is now ${status}`,
      type: 'status',
    });

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
