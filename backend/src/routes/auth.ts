import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

// Admin routes
router.get('/users', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.query;
    const User = require('../models/User').User;
    
    let filter: any = {};
    if (role) {
      filter.role = role.toUpperCase();
    }
    
    const users = await User.find(filter).select('-password');
    
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
