import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('applicant'), createApplication);
router.get('/', protect, getApplications);
router.patch('/:id/status', protect, authorizeRoles('recruiter'), updateApplicationStatus);

export default router;
