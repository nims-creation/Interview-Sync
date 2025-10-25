import { Router } from 'express';
import { googleAuth } from '../controllers/googleAuthController';

const router = Router();

// Google OAuth route
router.post('/google', googleAuth);

export default router;

