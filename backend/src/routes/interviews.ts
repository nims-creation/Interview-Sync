import { Router } from 'express';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  cancelInterview
} from '../controllers/interviewController';
import { authenticateToken, requireCandidateOrAdmin, requireInterviewerOrAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Routes accessible by candidates and admins
router.post('/', requireCandidateOrAdmin, createInterview);
router.get('/', getInterviews);

// Routes for specific interviews
router.get('/:id', getInterviewById);
router.put('/:id', requireInterviewerOrAdmin, updateInterview);
router.patch('/:id/cancel', cancelInterview);
router.delete('/:id', requireInterviewerOrAdmin, deleteInterview);

export default router;
