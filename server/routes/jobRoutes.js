import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  archiveJob,
} from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorizeRoles('recruiter'), createJob);
router.put('/:id', protect, authorizeRoles('recruiter'), updateJob);
router.delete('/:id', protect, authorizeRoles('recruiter'), deleteJob);
router.patch('/:id/archive', protect, authorizeRoles('recruiter'), archiveJob);

export default router;
