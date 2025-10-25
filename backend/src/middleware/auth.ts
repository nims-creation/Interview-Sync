import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        error: { code: 'NO_TOKEN' }
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // Verify user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
        error: { code: 'USER_NOT_FOUND' }
      });
      return;
    }

    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role.toLowerCase()
    };
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: { code: 'INVALID_TOKEN' }
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: { code: 'NO_AUTH' }
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: { code: 'FORBIDDEN' }
      });
      return;
    }

    next();
  };
};

// Specific role middlewares
export const requireCandidate = authorizeRoles('candidate');
export const requireInterviewer = authorizeRoles('interviewer');
export const requireAdmin = authorizeRoles('admin');
export const requireInterviewerOrAdmin = authorizeRoles('interviewer', 'admin');
export const requireCandidateOrAdmin = authorizeRoles('candidate', 'admin');
