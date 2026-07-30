import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { analyzeResume } from '../controllers/aiController.js';
import { resumeUpload } from '../utils/fileUpload.js';

const router = express.Router();

router.post('/analyze', protect, authorizeRoles('applicant'), resumeUpload.single('resume'), analyzeResume);

export default router;
