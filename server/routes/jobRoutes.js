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
import { validate, createJobValidation, updateJobValidation } from '../validators/requestValidator.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorizeRoles('recruiter'), validate(createJobValidation), createJob);
router.put('/:id', protect, authorizeRoles('recruiter'), validate(updateJobValidation), updateJob);
router.delete('/:id', protect, authorizeRoles('recruiter'), deleteJob);
router.patch('/:id/archive', protect, authorizeRoles('recruiter'), archiveJob);

export default router;
