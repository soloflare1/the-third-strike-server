import express from 'express';
import { createEntry, getEntries, verifyEntry, deleteEntry } from '../controllers/ledgerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createEntry);
router.get('/', getEntries);
router.put('/:id/verify', authorize('teacher'), verifyEntry);
router.delete('/:id', deleteEntry);

export default router;