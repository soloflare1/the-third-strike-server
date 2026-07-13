import express from 'express';
import { 
  generateSeatPlan, 
  getSeatPlan, 
  updateStudentSeat,
  validateSeatPlan 
} from '../controllers/seatController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher only routes
router.post('/generate', authorize('teacher'), generateSeatPlan);
router.put('/student', authorize('teacher'), updateStudentSeat);

// Everyone can view
router.get('/plan', getSeatPlan);
router.get('/validate', validateSeatPlan);

export default router;