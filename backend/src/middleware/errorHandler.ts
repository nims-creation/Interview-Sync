import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
  keyValue?: any;
  errors?: any;
  path?: string;
  isJoi?: boolean;
  details?: any[];
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default status code
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    statusCode: err.statusCode
  });

  // Handle specific Mongoose/MongoDB errors
  if (err.name === 'MongoServerError') {
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      res.status(409).json({
        success: false,
        message,
        error: { code: 'DUPLICATE_FIELD', field: Object.keys(err.keyValue)[0] }
      });
      return;
    }
  }

  if (err.name === 'ValidationError') {
    const message = 'Validation error';
    res.status(422).json({
      success: false,
      message,
      error: {
        code: 'VALIDATION_ERROR',
        details: Object.values(err.errors).map((e: any) => ({
          message: e.message,
          path: e.path
        }))
      }
    });
    return;
  }

  if (err.name === 'CastError') {
    const message = 'Invalid data format';
    res.status(400).json({
      success: false,
      message,
      error: { code: 'INVALID_FORMAT', field: err.path }
    });
    return;
  }

  // Handle validation errors (Joi)
  if (err.isJoi) {
    const message = 'Validation error';
    res.status(422).json({
      success: false,
      message,
      error: {
        code: 'VALIDATION_ERROR',
        details: err.details?.map((detail: any) => ({
          message: detail.message,
          path: detail.path
        }))
      }
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    res.status(401).json({
      success: false,
      message,
      error: { code: 'INVALID_TOKEN' }
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    res.status(401).json({
      success: false,
      message,
      error: { code: 'TOKEN_EXPIRED' }
    });
    return;
  }

  // Handle bcrypt errors
  if (err.name === 'Error' && err.message.includes('Invalid salt')) {
    const message = 'Invalid password';
    res.status(401).json({
      success: false,
      message,
      error: { code: 'INVALID_PASSWORD' }
    });
    return;
  }

  // Send generic error response
  res.status(err.statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
