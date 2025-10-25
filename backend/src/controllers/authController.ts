import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { User } from '../models/User';
import { logger } from '../utils/logger';

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid('CANDIDATE', 'INTERVIEWER', 'candidate', 'interviewer').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { email, password, name, role } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('User already exists with this email') as any;
      error.statusCode = 409;
      error.isOperational = true;
      return next(error);
    }

    // Normalize role to uppercase
    const normalizedRole = role.toUpperCase() as 'CANDIDATE' | 'INTERVIEWER';

    // Create user (password hashing is handled by the pre-save hook)
    const user = new User({
      email,
      password,
      name,
      role: normalizedRole
    });

    await user.save();

    const userResponse = {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase(),
      createdAt: user.createdAt
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: userResponse.id, email: userResponse.email, role: userResponse.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    logger.info(`New user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Invalid email or password') as any;
      error.statusCode = 401;
      error.isOperational = true;
      return next(error);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password') as any;
      error.statusCode = 401;
      error.isOperational = true;
      return next(error);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: (user._id as any).toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase()
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // For enhanced security, you could implement token blacklisting here

    logger.info('User logged out');

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // User info is attached by auth middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      const error = new Error('User not authenticated') as any;
      error.statusCode = 401;
      error.isOperational = true;
      return next(error);
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    const userResponse = {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error) {
    next(error);
  }
};
