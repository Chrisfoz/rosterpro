import request from 'supertest';
import app from '../../app';
import { createUser } from '../factories/user.factory';
import { pool } from '../../config/database';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await createUser({
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      const user = await createUser();
      const token = generateToken(user); // Helper function to generate JWT

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', user.email);
    });

    it('should fail when not authenticated', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
    });
  });
});