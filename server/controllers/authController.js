import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Recruiter from '../models/Recruiter.js';
import Applicant from '../models/Applicant.js';
import { validateRegisterInput } from '../validators/authValidator.js';

const generateToken = (user, role) => {
  return jwt.sign({ id: user._id, role }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '7d',
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, company, role, phone } = req.body;
    const errors = validateRegisterInput({ name, email, password });

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    if (role === 'recruiter') {
      const existing = await Recruiter.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Recruiter already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const recruiter = await Recruiter.create({
        name,
        email,
        password: hashedPassword,
        company,
        role: 'recruiter',
      });

      const token = generateToken(recruiter, 'recruiter');
      return res.status(201).json({ success: true, token, user: recruiter });
    }

    const existing = await Applicant.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Applicant already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const applicant = await Applicant.create({
      name,
      email,
      password: hashedPassword,
      phone,
      skills: [],
      resumeURL: '',
      role: 'applicant',
    });

    const token = generateToken(applicant, 'applicant');
    return res.status(201).json({ success: true, token, user: applicant });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'recruiter') {
      const recruiter = await Recruiter.findOne({ email });
      if (!recruiter) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, recruiter.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(recruiter, 'recruiter');
      return res.status(200).json({ success: true, token, user: recruiter });
    }

    const applicant = await Applicant.findOne({ email });
    if (!applicant) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, applicant.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(applicant, 'applicant');
    return res.status(200).json({ success: true, token, user: applicant });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
