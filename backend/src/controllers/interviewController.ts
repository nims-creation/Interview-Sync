import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Interview } from '../models/Interview';
import { Slot } from '../models/Slot';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { emailService } from '../utils/emailService';

// Validation schemas
const createInterviewSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  startTime: Joi.date().greater('now').required(),
  endTime: Joi.date().when('startTime', {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref('startTime')).required()
  }).required(),
  interviewerId: Joi.string().required(),
  slotId: Joi.string().required()
});

const updateInterviewSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED').optional(),
  videoLink: Joi.string().uri().optional(),
  notes: Joi.string().max(1000).optional()
});

export const createInterview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate input
    const { error, value } = createInterviewSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { title, description, startTime, endTime, interviewerId, slotId } = value;
    const candidateId = req.user!.id;

    // Check if slot exists and is available
    const slot = await Slot.findById(slotId).populate('interviewerId', 'id name email');

    if (!slot) {
      const error = new Error('Slot not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    if (!slot.isAvailable) {
      const error = new Error('Slot is not available') as any;
      error.statusCode = 409;
      error.isOperational = true;
      return next(error);
    }

    if (slot.interviewerId.toString() !== interviewerId) {
      const error = new Error('Slot does not belong to the specified interviewer') as any;
      error.statusCode = 400;
      error.isOperational = true;
      return next(error);
    }

    // Check if slot time matches interview time
    if (slot.startTime.getTime() !== new Date(startTime).getTime() ||
        slot.endTime.getTime() !== new Date(endTime).getTime()) {
      const error = new Error('Interview time must match slot time') as any;
      error.statusCode = 400;
      error.isOperational = true;
      return next(error);
    }

    // Check for scheduling conflicts
    const endTimeDate = new Date(endTime);
    const startTimeDate = new Date(startTime);
    const conflict = await Interview.findOne({
      $or: [
        {
          candidateId,
          startTime: { $lte: endTimeDate },
          endTime: { $gte: startTimeDate },
          status: { $ne: 'CANCELLED' }
        },
        {
          interviewerId,
          startTime: { $lte: endTimeDate },
          endTime: { $gte: startTimeDate },
          status: { $ne: 'CANCELLED' }
        }
      ]
    });

    if (conflict) {
      const error = new Error('Scheduling conflict detected') as any;
      error.statusCode = 409;
      error.isOperational = true;
      return next(error);
    }

    // Generate video link (using Jitsi Meet as example)
    const videoLink = `https://meet.jit.si/InterviewSync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create interview
    const interview = new Interview({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      candidateId,
      interviewerId,
      slotId,
      videoLink
    });
    await interview.save();

    // Populate relations
    await interview.populate([
      { path: 'candidateId', select: 'id name email' },
      { path: 'interviewerId', select: 'id name email' },
      { path: 'slotId' }
    ]);

    // Mark slot as unavailable
    slot.isAvailable = false;
    await slot.save();

    // Send email notifications
    try {
      const candidate = await User.findById(candidateId);
      const interviewer = await User.findById(interviewerId);
      
      if (candidate && interviewer) {
        // Send notification to candidate
        await emailService.sendInterviewScheduledEmail(
          candidate.email,
          candidate.name,
          interviewer.name,
          title,
          new Date(startTime),
          new Date(endTime),
          interview.videoLink
        );

        // Send notification to interviewer
        await emailService.sendInterviewerNotificationEmail(
          interviewer.email,
          interviewer.name,
          candidate.name,
          title,
          new Date(startTime),
          new Date(endTime)
        );
      }
    } catch (emailError) {
      logger.error('Failed to send email notifications:', emailError);
      // Don't fail the request if email fails
    }

    logger.info(`Interview created: ${title} for candidate ${candidateId}`);

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviews = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    let filter: any = { status: status || { $ne: null } };

    // Filter based on role
    if (userRole.toLowerCase() === 'candidate') {
      filter.candidateId = userId;
    } else if (userRole.toLowerCase() === 'interviewer') {
      filter.interviewerId = userId;
    }
    // Admin can see all

    const interviews = await Interview.find(filter)
      .populate([
        { path: 'candidateId', select: 'id name email' },
        { path: 'interviewerId', select: 'id name email' },
        { path: 'slotId' }
      ])
      .sort({ startTime: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Interview.countDocuments(filter);

    res.json({
      success: true,
      data: {
        interviews,
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

export const getInterviewById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const interview = await Interview.findById(id)
      .populate([
        { path: 'candidateId', select: 'id name email' },
        { path: 'interviewerId', select: 'id name email' },
        { path: 'slotId' }
      ]);

    if (!interview) {
      const error = new Error('Interview not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'candidate' && interview.candidateId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    if (userRole.toLowerCase() === 'interviewer' && interview.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    res.json({
      success: true,
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};

export const updateInterview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Validate input
    const { error, value } = updateInterviewSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    // Check if interview exists
    const interview = await Interview.findById(id).populate('slotId');

    if (!interview) {
      const error = new Error('Interview not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'candidate' && interview.candidateId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    if (userRole.toLowerCase() === 'interviewer' && interview.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    // Update interview
    Object.assign(interview, value);
    await interview.save();

    // Repopulate
    await interview.populate([
      { path: 'candidateId', select: 'id name email' },
      { path: 'interviewerId', select: 'id name email' },
      { path: 'slotId' }
    ]);

    logger.info(`Interview updated: ${id}`);

    res.json({
      success: true,
      message: 'Interview updated successfully',
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelInterview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if interview exists
    const interview = await Interview.findById(id).populate('slotId');

    if (!interview) {
      const error = new Error('Interview not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'candidate' && interview.candidateId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    if (userRole.toLowerCase() === 'interviewer' && interview.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    // Update interview status to cancelled
    interview.status = 'CANCELLED';
    await interview.save();

    // Make slot available again
    const slot = await Slot.findById(interview.slotId);
    if (slot) {
      slot.isAvailable = true;
      await slot.save();
    }

    // Send cancellation email
    try {
      const candidate = await User.findById(interview.candidateId);
      if (candidate) {
        await emailService.sendInterviewCancelledEmail(
          candidate.email,
          candidate.name,
          interview.title,
          'Interview cancelled by user'
        );
      }
    } catch (emailError) {
      logger.error('Failed to send cancellation email:', emailError);
    }

    logger.info(`Interview cancelled: ${id}`);

    res.json({
      success: true,
      message: 'Interview cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if interview exists
    const interview = await Interview.findById(id).populate('slotId');

    if (!interview) {
      const error = new Error('Interview not found') as any;
      error.statusCode = 404;
      error.isOperational = true;
      return next(error);
    }

    // Check permissions
    if (userRole.toLowerCase() === 'candidate' && interview.candidateId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    if (userRole.toLowerCase() === 'interviewer' && interview.interviewerId.toString() !== userId) {
      const error = new Error('Access denied') as any;
      error.statusCode = 403;
      error.isOperational = true;
      return next(error);
    }

    // Delete interview and make slot available again
    await Interview.findByIdAndDelete(id);

    const slot = await Slot.findById(interview.slotId);
    if (slot) {
      slot.isAvailable = true;
      await slot.save();
    }

    logger.info(`Interview deleted: ${id}`);

    res.json({
      success: true,
      message: 'Interview cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};
