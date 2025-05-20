const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the ProgramRepository
jest.mock('../domain/repository/ProgramRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));
const ProgramRepository = require('../domain/repository/ProgramRepository');

// Mock auth middleware
jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { id: 1 }; // Simulate authenticated user
    next();
  }
}));

describe('Program API Tests', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    // Create express app
    app = express();
    app.use(express.json());
    
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    
    // Setup routes - import after mocks are set up
    const ProgramRoutes = require('../routes/ProgramRoutes');
    app.use('/api/program', ProgramRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/program', () => {
    it('should create a new program with valid data', async () => {
      const mockProgram = {
        id: 1,
        title: 'Test Program',
        description: 'Test Description',
        createdById: 1
      };
      ProgramRepository.create.mockResolvedValue(mockProgram);

      const response = await request(app)
        .post('/api/program')
        .send({
          title: 'Test Program',
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockProgram);
    });

    it('should successfully create without description', async () => {
      const mockProgram = {
        id: 1,
        title: 'Test Program',
        createdById: 1
      };
      ProgramRepository.create.mockResolvedValue(mockProgram);

      const response = await request(app)
        .post('/api/program')
        .send({
          title: 'Test Program'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockProgram);
    });
  });

  describe('GET /api/program', () => {
    it('should get all programs', async () => {
      const mockPrograms = [
        { id: 1, title: 'Program 1' },
        { id: 2, title: 'Program 2' }
      ];
      ProgramRepository.findAll.mockResolvedValue(mockPrograms);

      const response = await request(app)
        .get('/api/program');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPrograms);
    });
  });

  describe('GET /api/program/:id', () => {
    it('should get a single program', async () => {
      const mockProgram = {
        id: 1,
        title: 'Test Program',
        description: 'Test Description'
      };
      ProgramRepository.findById.mockResolvedValue(mockProgram);

      const response = await request(app)
        .get('/api/program/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProgram);
    });

    it('should return 404 for non-existent program', async () => {
      ProgramRepository.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/program/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/program/:id', () => {
    it('should return true when updating existing program', async () => {
      ProgramRepository.update.mockResolvedValue(true);

      const response = await request(app)
        .put('/api/program/1')
        .send({
          title: 'Updated Program',
          description: 'Updated Description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toBe(true);
    });

    it('should return 404 when updating non-existent program', async () => {
      ProgramRepository.update.mockResolvedValue(false);

      const response = await request(app)
        .put('/api/program/999')
        .send({
          title: 'Updated Program'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/program/:id', () => {
    it('should delete an existing program', async () => {
      ProgramRepository.delete.mockResolvedValue({ success: true });

      const response = await request(app)
        .delete('/api/program/1')
        .send({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should handle non-existent program deletion', async () => {
      ProgramRepository.delete.mockResolvedValue({ success: false });

      const response = await request(app)
        .delete('/api/program/999')
        .send({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: false });
    });
  });
});