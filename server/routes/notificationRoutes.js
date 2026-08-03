import express from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, sendInterviewEmail } from '../controllers/notificationController.js';
import { validate, interviewEmailValidation } from '../validators/requestValidator.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/interview', protect, validate(interviewEmailValidation), sendInterviewEmail);

export default router;
