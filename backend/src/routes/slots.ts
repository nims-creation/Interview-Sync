import { Router } from 'express';
import {
  createSlot,
  getSlots,
  getSlotById,
  updateSlot,
  deleteSlot
} from '../controllers/slotController';
import { authenticateToken, requireInterviewerOrAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Routes accessible by interviewers and admins
router.post('/', requireInterviewerOrAdmin, createSlot);
router.get('/', getSlots);
router.get('/:id', getSlotById);
router.put('/:id', requireInterviewerOrAdmin, updateSlot);
router.delete('/:id', requireInterviewerOrAdmin, deleteSlot);

export default router;
