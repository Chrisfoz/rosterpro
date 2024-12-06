import request from 'supertest';
import app from '../../app';
import { createUser } from '../factories/user.factory';
import { format } from 'date-fns';

describe('Availability Endpoints', () => {
  describe('POST /api/availability', () => {
    it('should update availability successfully', async () => {
      const user = await createUser();
      const token = generateToken(user);

      const response = await request(app)
        .post('/api/availability')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: format(new Date(), 'yyyy-MM-dd'),
          isAvailable: false,
          reason: 'Vacation',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isAvailable', false);
    });
  });

  describe('GET /api/availability/month/:yearMonth', () => {
    it('should return monthly availability', async () => {
      const user = await createUser();
      const token = generateToken(user);
      const yearMonth = format(new Date(), 'yyyy-MM');

      // Create some test availability data
      await createAvailability(user.id, new Date());

      const response = await request(app)
        .get(`/api/availability/month/${yearMonth}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});