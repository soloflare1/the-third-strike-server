import express from 'express';
import { createSOS, getSOSAlerts, respondToSOS } from '../controllers/sosController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createSOS);
router.get('/', getSOSAlerts);
router.put('/:id/respond', authorize('captain', 'teacher'), respondToSOS);

export default router;