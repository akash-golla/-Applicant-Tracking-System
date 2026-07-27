import express from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, sendInterviewEmail } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/interview', protect, sendInterviewEmail);

export default router;
