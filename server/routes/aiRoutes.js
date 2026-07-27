import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { analyzeResume } from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', protect, authorizeRoles('applicant'), analyzeResume);

export default router;
