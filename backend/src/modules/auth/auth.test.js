import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server.js';
import User from './auth.model.js';
import { authenticate, requireAdmin } from './auth.middleware.js';

beforeAll(async () => {
  const url = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1/cinema_test_db';
  await mongoose.connect(url);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication & Security Test Suite', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpassword',
    role: 'admin'
  };

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user.name).toBe(validUser.name);
      expect(res.body.user.role).toBe('user');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/registered/i);
    });

    it('should reject registration with invalid input', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: '', email: 'invalidemail', password: '123' });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should successfully login and set HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.statusCode).toEqual(200);
      expect(res.headers['set-cookie'][0]).toMatch(/jwt=/);
      expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('Protected Routes & Authorization', () => {
    let userCookie;
    let adminCookie;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const userLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });
      userCookie = userLogin.headers['set-cookie'];

      await User.create(adminUser);
      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: adminUser.email, password: adminUser.password });
      adminCookie = adminLogin.headers['set-cookie'];
    });

    it('should retrieve current user data after login', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', userCookie);

      expect(res.statusCode).toEqual(200);
      expect(res.body.user.email).toBe(validUser.email);
    });

    it('should deny retrieving user data without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
    });

    it('should successfully logout and clear cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', userCookie);

      expect(res.statusCode).toEqual(200);
      expect(res.headers['set-cookie'][0]).toMatch(/jwt=;/);
    });

    it('should deny regular user access to Admin endpoints', async () => {
      app.get('/api/admin-test', authenticate, requireAdmin, (req, res) => {
        res.status(200).json({ success: true });
      });

      const res = await request(app)
        .get('/api/admin-test')
        .set('Cookie', userCookie);

      expect(res.statusCode).toEqual(403);
    });

    it('should allow admin access to Admin endpoints', async () => {
      const res = await request(app)
        .get('/api/admin-test')
        .set('Cookie', adminCookie);

      expect(res.statusCode).toEqual(200);
    });
  });
});