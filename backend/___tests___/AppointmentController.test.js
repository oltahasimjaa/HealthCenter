const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the repository
jest.mock('../domain/repository/AppointmentRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
const AppointmentRepository = require('../domain/repository/AppointmentRepository');

describe('Appointment Controller Boundary Tests', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    app = express();
    app.use(express.json());

    const AppointmentRoutes = require('../routes/AppointmentRoutes');
    app.use('/api/appointment', AppointmentRoutes);

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

  describe('POST /api/appointment - boundary checks', () => {
    it('should accept valid appointment data', async () => {
      const validAppointment = {
        mysqlId: '1',
        userId: new mongoose.Types.ObjectId().toString(),
        specialistId: new mongoose.Types.ObjectId().toString(),
        appointmentDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        type: 'training',
        status: 'pending'
      };

      const mockResponse = { ...validAppointment, _id: new mongoose.Types.ObjectId() };
      AppointmentRepository.create.mockResolvedValue(mockResponse);

      const response = await request(app).post('/api/appointment').send(validAppointment);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ type: 'training', status: 'pending' });
    });

    it('should reject when required fields are missing', async () => {
      const response = await request(app).post('/api/appointment').send({});
      expect(response.status).toBe(400);
    });

    it('should reject if appointmentDate is in the past', async () => {
      const appointment = {
        mysqlId: '1',
        userId: new mongoose.Types.ObjectId().toString(),
        specialistId: new mongoose.Types.ObjectId().toString(),
        appointmentDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        type: 'training',
        status: 'pending'
      };
      const response = await request(app).post('/api/appointment').send(appointment);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/appointmentDate must be a valid future date/i);


    });

    it('should reject invalid ObjectId for userId', async () => {
      const appointment = {
        mysqlId: '1',
        userId: 'invalid-id',
        specialistId: new mongoose.Types.ObjectId().toString(),
        appointmentDate: new Date(Date.now() + 86400000).toISOString(),
        type: 'consultation',
        status: 'pending'
      };
      const response = await request(app).post('/api/appointment').send(appointment);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/appointment/:id - get by ID', () => {
    it('should return appointment when found', async () => {
      const appointmentId = new mongoose.Types.ObjectId();
      const mockAppointment = {
        _id: appointmentId,
        mysqlId: '1',
        userId: new mongoose.Types.ObjectId(),
        specialistId: new mongoose.Types.ObjectId(),
        appointmentDate: new Date(Date.now() + 86400000),
        type: 'consultation',
        status: 'confirmed'
      };

      AppointmentRepository.findById.mockResolvedValue(mockAppointment);

      const response = await request(app).get(`/api/appointment/${appointmentId}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ _id: appointmentId.toString(), type: 'consultation' });
    });

    it('should return 404 when appointment not found', async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      AppointmentRepository.findById.mockResolvedValue(null);
      const response = await request(app).get(`/api/appointment/${nonExistingId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Appointment not found');
    });

    it('should reject malformed ID', async () => {
      const response = await request(app).get('/api/appointment/invalid-id');
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/appointment/:id - update appointment', () => {
    it('should update existing appointment', async () => {
      const appointmentId = new mongoose.Types.ObjectId();
      const updateData = {
        status: 'completed',
        type: 'follow-up'
      };

      const updatedAppointment = {
        _id: appointmentId,
        mysqlId: '1',
        userId: new mongoose.Types.ObjectId(),
        specialistId: new mongoose.Types.ObjectId(),
        appointmentDate: new Date(Date.now() + 86400000),
        type: 'follow-up',
        status: 'completed',
        updatedAt: new Date()
      };

      AppointmentRepository.update.mockResolvedValue(updatedAppointment);

      const response = await request(app).put(`/api/appointment/${appointmentId}`).send(updateData);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ status: 'completed', type: 'follow-up' });
    });

    it('should return 404 when updating non-existent appointment', async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
      AppointmentRepository.update.mockResolvedValue(null);
      const response = await request(app).put(`/api/appointment/${nonExistingId}`).send({ status: 'completed' });
      expect(response.status).toBe(404);
    });

    it('should reject update with malformed ID', async () => {
      const response = await request(app).put('/api/appointment/invalid-id').send({ status: 'completed' });
      expect(response.status).toBe(400);
    });

    it('should reject invalid fields (e.g. appointmentDate in past)', async () => {
      const appointmentId = new mongoose.Types.ObjectId();
      const response = await request(app).put(`/api/appointment/${appointmentId}`).send({
        appointmentDate: new Date(Date.now() - 86400000).toISOString()
      });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/appointment/:id - non-existing ID', () => {
    it('should return 404 when appointment not found', async () => {
      const nonExistingId = new mongoose.Types.ObjectId();
AppointmentRepository.delete.mockResolvedValue(false);
const response = await request(app).delete(`/api/appointment/${nonExistingId}`);
expect(response.status).toBe(404);
expect(response.body.message).toBe('Appointment not found');
    });

    it('should reject malformed ID', async () => {
      const response = await request(app).delete('/api/appointment/invalid-id');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/appointment - when no data exists', () => {
    it('should return empty array', async () => {
      AppointmentRepository.findAll.mockResolvedValue([]);
      const response = await request(app).get('/api/appointment');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
