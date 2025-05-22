const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the repository
jest.mock('../domain/repository/ScheduleRepository', () => ({
findAll: jest.fn(),  // Changed from findAll
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
const ScheduleRepository = require('../domain/repository/ScheduleRepository');

describe('Schedule Controller Boundary Tests', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    app = express();
    app.use(express.json());

    // Assume there's middleware or validation in the route or use case
    const ScheduleRoutes = require('../routes/ScheduleRoutes');
    app.use('/api/schedule', ScheduleRoutes);

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/schedule - boundary checks', () => {
    it('should reject empty workDays array', async () => {
      const response = await request(app).post('/api/schedule').send({
        workDays: [],
        startTime: '08:00',
        endTime: '17:00'
      });
      expect(response.status).toBe(400);
    });

    it('should reject invalid time format for startTime', async () => {
      const response = await request(app).post('/api/schedule').send({
        workDays: ['Monday'],
        startTime: '8am',
        endTime: '17:00'
      });
      expect(response.status).toBe(400);
    });

    it('should accept minimal valid data (1-minute range)', async () => {
      const schedule = {
        id: '1',
        workDays: ['Monday'],
        startTime: '08:00',
        endTime: '08:01'
      };
      ScheduleRepository.create.mockResolvedValue(schedule);
      const response = await request(app).post('/api/schedule').send(schedule);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(schedule);
    });

    it('should reject very long unavailableDates array (upper bound)', async () => {
      const longUnavailableDates = Array(1001).fill('2025-04-10');
      const response = await request(app).post('/api/schedule').send({
        workDays: ['Monday'],
        startTime: '08:00',
        endTime: '17:00',
        unavailableDates: longUnavailableDates
      });
      expect(response.status).toBe(400);
    });
    it('should reject when startTime equals endTime', async () => {
    const response = await request(app).post('/api/schedule').send({
      workDays: ['Monday'],
      startTime: '08:00',
      endTime: '08:00'
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("startTime must be before endTime");
  });

  it('should reject when startTime is after endTime', async () => {
    const response = await request(app).post('/api/schedule').send({
      workDays: ['Monday'],
      startTime: '09:00',
      endTime: '08:00'
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("startTime must be before endTime");
  });

  it('should accept when startTime is 1 minute before endTime', async () => {
    const schedule = {
      workDays: ['Monday'],
      startTime: '08:00',
      endTime: '08:01'
    };
    ScheduleRepository.create.mockResolvedValue(schedule);
    const response = await request(app).post('/api/schedule').send(schedule);
    expect(response.status).toBe(201);
  });
  });

  describe('PUT /api/schedule/:id - update boundary checks', () => {
    it('should reject update with missing required fields', async () => {
      const response = await request(app)
        .put('/api/schedule/1')
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 404 if valid update data is provided but ID not found', async () => {
      ScheduleRepository.update.mockResolvedValue(null);
      const response = await request(app).put('/api/schedule/999').send({
        workDays: ['Tuesday'],
        startTime: '09:00',
        endTime: '18:00'
      });
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/schedule/:id - malformed ID check', () => {
    it('should reject malformed ID', async () => {
      const response = await request(app).get('/api/schedule/invalid-id');
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/schedule/:id - non-existing ID', () => {
    it('should return 404 when schedule not found', async () => {
      ScheduleRepository.delete.mockResolvedValue(false);
      const response = await request(app).delete('/api/schedule/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Schedule not found');
    });
  });

  describe('GET /api/schedule - when no data exists', () => {
    it('should return empty array', async () => {
      ScheduleRepository.findAll.mockResolvedValue([]);
      const response = await request(app).get('/api/schedule');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
