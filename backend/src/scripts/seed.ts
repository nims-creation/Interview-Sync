import mongoose from 'mongoose';
import { User } from '../models/User';
import { Slot } from '../models/Slot';
import { logger } from '../utils/logger';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-scheduling');
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Slot.deleteMany({});
    logger.info('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: 'admin@interviewsync.com',
      password: 'admin123',
      name: 'System Administrator',
      role: 'ADMIN'
    });
    await adminUser.save();
    logger.info('Admin user created: admin@interviewsync.com / admin123');

    // Create interviewers
    const interviewer1 = new User({
      name: 'John Smith',
      email: 'john.smith@company.com',
      password: 'interviewer123',
      role: 'INTERVIEWER'
    });
    await interviewer1.save();

    const interviewer2 = new User({
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      password: 'interviewer123',
      role: 'INTERVIEWER'
    });
    await interviewer2.save();

    const interviewer3 = new User({
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      password: 'interviewer123',
      role: 'INTERVIEWER'
    });
    await interviewer3.save();

    const interviewers = [interviewer1, interviewer2, interviewer3];
    logger.info('Created interviewers');

    // Create time slots for the next 7 days
    const slots = [];
    const now = new Date();

    for (let day = 0; day < 7; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() + day);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Create slots from 9 AM to 5 PM (8 hours)
      for (let hour = 9; hour < 17; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);

        // Assign to random interviewer
        const interviewer = interviewers[Math.floor(Math.random() * interviewers.length)];

        slots.push({
          startTime,
          endTime,
          interviewerId: interviewer._id,
          isAvailable: true
        });
      }
    }

    await Slot.insertMany(slots);
    logger.info(`Created ${slots.length} time slots`);

    logger.info('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
