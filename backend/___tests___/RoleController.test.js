const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the RoleRepository
jest.mock('../domain/repository/RoleRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));
const RoleRepository = require('../domain/repository/RoleRepository');

// Mock auth middleware
jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { id: 1 };
    next();
  }
}));

describe('Role API Tests', () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    app = express();
    app.use(express.json());

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const RoleRoutes = require('../routes/RoleRoutes');
    app.use('/api/role', RoleRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/role', () => {
    it('should create a new role with valid data', async () => {
      const mockRole = {
        id: 1,
        name: 'Admin',
        permissions: ['read', 'write'],
        createdById: 1
      };
      RoleRepository.create.mockResolvedValue(mockRole);

      const response = await request(app)
        .post('/api/role')
        .send({
          name: 'Admin',
          permissions: ['read', 'write']
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockRole);
    });

    it('should return 400 when missing required fields', async () => {
      const response = await request(app)
        .post('/api/role')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Missing required field: name" });
    });

    // NEW TEST CASES ADDED BELOW (original code remains untouched above)
    it('should create role with empty permissions array', async () => {
      const mockRole = {
        id: 2,
        name: 'Guest',
        permissions: [],
        createdById: 1
      };
      RoleRepository.create.mockResolvedValue(mockRole);
      
      const res = await request(app)
        .post('/api/role')
        .send({name: "Guest", permissions: []});
      
      expect(res.status).toBe(201);
      expect(res.body.permissions).toEqual([]);
    });

  
  });

  describe('GET /api/role', () => {
    it('should get all roles', async () => {
      const mockRoles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' }
      ];
      RoleRepository.findAll.mockResolvedValue(mockRoles);

      const response = await request(app).get('/api/role');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoles);
    });

    // NEW TEST CASE ADDED BELOW
    it('should return empty array when no roles exist', async () => {
      RoleRepository.findAll.mockResolvedValue([]);
      const res = await request(app).get('/api/role');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/role/:id', () => {
    it('should get a single role', async () => {
      const mockRole = { id: 1, name: 'Admin' };
      RoleRepository.findById.mockResolvedValue(mockRole);

      const response = await request(app).get('/api/role/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRole);
    });

    it('should return 404 for non-existent role', async () => {
      RoleRepository.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/role/999');

      expect(response.status).toBe(404);
    });

  });

  describe('PUT /api/role/:id', () => {
    it('should update an existing role', async () => {
      const updatedRole = { id: 1, name: 'Super Admin' };
      RoleRepository.update.mockResolvedValue(updatedRole);

      const response = await request(app)
        .put('/api/role/1')
        .send({ name: 'Super Admin' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedRole);
    });

    it('should return 404 for non-existent role', async () => {
      RoleRepository.update.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/role/999')
        .send({ name: 'Ghost' });

      expect(response.status).toBe(404);
    });

    // NEW TEST CASES ADDED BELOW
    it('should update only permissions when provided', async () => {
      const updatedRole = { id: 1, name: 'Admin', permissions: ['new'] };
      RoleRepository.update.mockResolvedValue(updatedRole);

      const res = await request(app)
        .put('/api/role/1')
        .send({ permissions: ['new'] });

      expect(res.status).toBe(200);
      expect(res.body.permissions).toEqual(['new']);
    });

  
  });

  describe('DELETE /api/role/:id', () => {
    it('should delete an existing role', async () => {
      RoleRepository.delete.mockResolvedValue(true);

      const response = await request(app).delete('/api/role/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Role deleted" });
    });

    it('should return 404 when deleting non-existent role', async () => {
      RoleRepository.delete.mockResolvedValue(false);

      const response = await request(app).delete('/api/role/999');

      expect(response.status).toBe(404);
    });

  });
});