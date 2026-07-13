import express from 'express';
import { checkClaim, getAllRules, createRule } from '../controllers/factcheckController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/check', checkClaim);
router.get('/rules', getAllRules);
router.post('/rules', authorize('teacher'), createRule);

export default router;