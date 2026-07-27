import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { recruiterDashboard, applicantDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/recruiter', protect, authorizeRoles('recruiter'), recruiterDashboard);
router.get('/applicant', protect, authorizeRoles('applicant'), applicantDashboard);

export default router;
