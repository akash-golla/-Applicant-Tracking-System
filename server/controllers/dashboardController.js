import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Applicant from '../models/Applicant.js';

export const recruiterDashboard = async (req, res) => {
  try {
    const jobs = await Job.countDocuments({ recruiterId: req.user._id });
    const applications = await Application.countDocuments({
      jobId: { $in: await Job.find({ recruiterId: req.user._id }).select('_id') },
    });
    const applicants = await Applicant.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        jobs,
        applications,
        applicants,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applicantDashboard = async (req, res) => {
  try {
    const applications = await Application.countDocuments({ applicantId: req.user._id });
    const jobs = await Job.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      stats: {
        applications,
        jobs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
