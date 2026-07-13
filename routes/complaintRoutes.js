import express from 'express';
import {
  submitComplaint,
  getComplaints,
  verifyComplaint,
  getStrikeStatus,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Student routes
router.post('/', protect, uploadSingle, submitComplaint);

// Teacher routes
router.get('/', protect, authorize('teacher'), getComplaints);
router.put('/:id/verify', protect, authorize('teacher'), verifyComplaint);

// ✅ Strike status (everyone) - এই Route যোগ করুন
router.get('/strike/status', protect, getStrikeStatus);

export default router;