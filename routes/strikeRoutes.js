import express from 'express';
import {
  createStrike,
  getStrikes,
  getStrikeById,
  updateStrikeStatus,
} from '../controllers/strikeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher only routes
router.post('/', authorize('teacher'), createStrike);
router.get('/', authorize('teacher'), getStrikes);
router.get('/:id', authorize('teacher'), getStrikeById);
router.put('/:id/status', authorize('teacher'), updateStrikeStatus);

export default router;