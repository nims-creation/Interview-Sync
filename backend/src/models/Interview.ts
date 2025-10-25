import mongoose, { Document, Schema } from 'mongoose';

export interface IInterview extends Document {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  videoLink?: string;
  notes?: string;
  candidateId: mongoose.Types.ObjectId;
  interviewerId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
    default: 'SCHEDULED'
  },
  videoLink: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
interviewSchema.index({ candidateId: 1, startTime: -1 });
interviewSchema.index({ interviewerId: 1, startTime: -1 });
interviewSchema.index({ startTime: 1, endTime: 1 });

export const Interview = mongoose.model<IInterview>('Interview', interviewSchema);
