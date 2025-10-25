import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Slot } from '../models/Slot';
import { User } from '../models/User';
import { Interview } from '../models/Interview';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

// Validation schemas
const createSlotSchema = Joi.object({
  startTime: Joi.date().greater('now').required(),
  endTime: Joi.date().when('startTime', {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref('startTime')).required()
  }).required()
});

const updateSlotSchema = Joi.object({
  startTime: Joi.date().greater('now').optional(),
  endTime: Joi.date().when('startTime', {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref('startTime')).optional()
  }).optional(),
  isAvailable: Joi.boolean().optional()
});

export const createSlot = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const { error, value } = createSlotSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { startTime, endTime } = value;
    const interviewerId = req.user!.id;

    // Check for scheduling conflicts
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(startTime);
    const conflict = await Slot.findOne({
      interviewerId,
      $or: [
        {
          startTime: { $lte: endTimeDate },
          endTime: { $gte: startTimeDate }
        }
      ]
    });

    if (conflict) {
      const error = new Error('Time slot conflict with existing slot') as any;
      error.statusCode = 409;
      error.isOperational = true;
      return next(error);
    }

    // Create slot
    const slot = new Slot({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      interviewerId
    });
    await slot.save();

    // Populate interviewer
    await slot.populate('interviewer', 'id name email');

    logger.info(`Slot created: ${slot._id} for interviewer ${interviewerId}`);

    res.status(201).json({
      success: true,
      message: 'Time slot created successfully',
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

export const getSlots = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { interviewerId, startDate, endDate, available, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    let filter: any = {};

    // Filter by interviewer
    if (interviewerId) {
      filter.interviewerId = interviewerId;
    } else if (userRole.toLowerCase() === 'interviewer') {
      filter.interviewerId = userId;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) {
        filter.startTime.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.startTime.$lte = new Date(endDate as string);
      }
    }

    // Filter by availability
    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }

    const slots = await Slot.find(filter)
      .populate('interviewerId', 'id name email')
      .populate({
        path: 'interviewId',
        select: 'id title',
        populate: {
          path: 'candidateId',
          select: 'id name email'
        }
      })
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Slot.countDocuments(filter);

    res.json({
      success: true,
      data: {
        slots,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSlotById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const slot = await Slot.findById(id)
      .populate('interviewerId', 'id name email')
      .populate({
        path: 'interviewId',
        select: 'id title',
        populate: {
          path: 'candidateId',
          select: 'id name email'
        }
      });

    if (!slot) {
      const error = new Error('Slot not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'interviewer' && slot.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    res.json({
      success: true,
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Validate input
    const { error, value } = updateSlotSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Check if slot exists
    const slot = await Slot.findById(id).populate('interview');

    if (!slot) {
      const error = new Error('Slot not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'interviewer' && slot.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    // Prevent updating slots that have interviews
    if (slot.interviewId && value.isAvailable === false) {
      const error = new Error('Cannot make slot unavailable when it has a scheduled interview') as any;
      error.statusCode = 409;
      error.isOperational = true;
      return next(error);
    }

    // Check for conflicts if updating time
    if (value.startTime || value.endTime) {
      const newStartTime = value.startTime ? new Date(value.startTime) : slot.startTime;
      const newEndTime = value.endTime ? new Date(value.endTime) : slot.endTime;

      const conflict = await Slot.findOne({
        interviewerId: slot.interviewerId,
        _id: { $ne: id },
        $or: [
          {
            startTime: { $lte: newEndTime },
            endTime: { $gte: newStartTime }
          }
        ]
      });

      if (conflict) {
        const error = new Error('Time slot conflict with existing slot') as any;
        error.statusCode = 409;
        error.isOperational = true;
        return next(error);
      }
    }

    // Update slot
    Object.assign(slot, value);
    if (value.startTime) slot.startTime = new Date(value.startTime);
    if (value.endTime) slot.endTime = new Date(value.endTime);
    await slot.save();

    // Repopulate
    await slot.populate('interviewerId', 'id name email');
    await slot.populate({
      path: 'interviewId',
      select: 'id title',
      populate: {
        path: 'candidateId',
        select: 'id name email'
      }
    });

    logger.info(`Slot updated: ${id}`);

    res.json({
      success: true,
      message: 'Slot updated successfully',
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if slot exists
    const slot = await Slot.findById(id).populate('interview');

    if (!slot) {
      const error = new Error('Slot not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'interviewer' && slot.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    // Prevent deleting slots that have interviews
    if (slot.interviewId) {
      const error = new Error('Cannot delete slot that has a scheduled interview') as any;
      error.statusCode = 409;
      error.isOperational = true;
      return next(error);
    }

    // Delete slot
    await Slot.findByIdAndDelete(id);

    logger.info(`Slot deleted: ${id}`);

    res.json({
      success: true,
      message: 'Slot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
