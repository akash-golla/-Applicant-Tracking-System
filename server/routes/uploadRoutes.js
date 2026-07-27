import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { uploadResume } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('applicant'), uploadResume);

export default router;
