import request from 'supertest';
import app from '../src/server';
import { connectDB, disconnectDB } from '../src/config/database';
import { User } from '../src/models/User';
import { Interview } from '../src/models/Interview';
import { Slot } from '../src/models/Slot';

describe('Interview Scheduling API', () => {
  let authToken: string;
  let candidateId: string;
  let interviewerId: string;
  let slotId: string;

  beforeAll(async () => {
    await connectDB();
    
    // Create test users
    const candidate = new User({
      email: 'test.candidate@example.com',
      password: 'password123',
      name: 'Test Candidate',
      role: 'CANDIDATE'
    });
    await candidate.save();
    candidateId = candidate._id.toString();

    const interviewer = new User({
      email: 'test.interviewer@example.com',
      password: 'password123',
      name: 'Test Interviewer',
      role: 'INTERVIEWER'
    });
    await interviewer.save();
    interviewerId = interviewer._id.toString();

    // Create test slot
    const slot = new Slot({
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
      interviewerId,
      isAvailable: true
    });
    await slot.save();
    slotId = slot._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Interview.deleteMany({});
    await Slot.deleteMany({});
    await disconnectDB();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new.user@example.com',
          password: 'password123',
          name: 'New User',
          role: 'candidate'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('new.user@example.com');
    });

    it('should login a user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.candidate@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      
      authToken = response.body.data.token;
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.candidate@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Interviews', () => {
    it('should create a new interview', async () => {
      const response = await request(app)
        .post('/api/interviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Interview',
          description: 'A test interview',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          interviewerId,
          slotId
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.interview.title).toBe('Test Interview');
    });

    it('should get user interviews', async () => {
      const response = await request(app)
        .get('/api/interviews')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.interviews).toBeInstanceOf(Array);
    });

    it('should cancel an interview', async () => {
      // First create an interview
      const interview = new Interview({
        title: 'Test Interview to Cancel',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        candidateId,
        interviewerId,
        slotId
      });
      await interview.save();

      const response = await request(app)
        .patch(`/api/interviews/${interview._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Slots', () => {
    it('should get available slots', async () => {
      const response = await request(app)
        .get('/api/slots')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slots).toBeInstanceOf(Array);
    });

    it('should create a new slot (interviewer)', async () => {
      // Login as interviewer
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.interviewer@example.com',
          password: 'password123'
        });

      const interviewerToken = loginResponse.body.data.token;

      const response = await request(app)
        .post('/api/slots')
        .set('Authorization', `Bearer ${interviewerToken}`)
        .send({
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .get('/api/interviews');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should handle invalid token', async () => {
      const response = await request(app)
        .get('/api/interviews')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
