import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot extends Document {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  interviewerId: mongoose.Types.ObjectId;
  interviewId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const slotSchema = new Schema<ISlot>({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  interviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Interview'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
slotSchema.index({ interviewerId: 1, startTime: -1 });
slotSchema.index({ startTime: 1, endTime: 1 });
slotSchema.index({ isAvailable: 1 });

// Ensure no overlapping slots for the same interviewer
slotSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('startTime') || this.isModified('endTime')) {
    const overlappingSlot = await mongoose.model('Slot').findOne({
      interviewerId: this.interviewerId,
      _id: { $ne: this._id },
      $or: [
        {
          startTime: { $lt: this.endTime },
          endTime: { $gt: this.startTime }
        }
      ]
    });

    if (overlappingSlot) {
      const error = new Error('Time slot conflict with existing slot');
      return next(error);
    }
  }
  next();
});

export const Slot = mongoose.model<ISlot>('Slot', slotSchema);
