import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      const error = new Error('Google token is required') as any;
      error.statusCode = 400;
      error.isOperational = true;
      return next(error);
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      const error = new Error('Invalid Google token') as any;
      error.statusCode = 401;
      error.isOperational = true;
      return next(error);
    }

    const { email, name, sub: googleId } = payload;

    if (!email || !name) {
      const error = new Error('Invalid Google token payload') as any;
      error.statusCode = 401;
      error.isOperational = true;
      return next(error);
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google OAuth
      user = new User({
        email,
        name,
        password: '', // No password for OAuth users
        role: 'CANDIDATE', // Default role, can be changed later
        googleId
      });

      await user.save();
      logger.info(`New user registered via Google: ${email}`);
    } else if (!user.googleId) {
      // Link existing user with Google account
      user.googleId = googleId;
      await user.save();
      logger.info(`Existing user linked with Google: ${email}`);
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { 
        id: (user._id as any).toString(), 
        email: user.email, 
        role: user.role.toLowerCase() 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    const userResponse = {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase(),
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: userResponse,
        token: jwtToken
      }
    });

  } catch (error) {
    logger.error('Google authentication error:', error);
    next(error);
  }
};
