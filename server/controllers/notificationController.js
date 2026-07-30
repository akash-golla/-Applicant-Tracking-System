import Notification from '../models/Notification.js';
import { sendEmailNotification } from '../services/emailService.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendInterviewEmail = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, message: 'Email and message are required' });
    }

    await sendEmailNotification({
      to: email,
      subject: 'Interview Invitation',
      text: message,
    });

    await Notification.create({
      userId: req.user._id,
      userModel: req.user.role === 'recruiter' ? 'Recruiter' : 'Applicant',
      message: `Interview email sent to ${email}`,
      type: 'email',
    });

    res.status(200).json({ success: true, message: 'Interview email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
