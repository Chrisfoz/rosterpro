import request from 'supertest';
import app from '../../app';
import { createUser } from '../factories/user.factory';
import { createRole } from '../factories/role.factory';
import { format } from 'date-fns';

describe('Roster Endpoints', () => {
  describe('POST /api/roster/assign', () => {
    it('should create a roster assignment successfully', async () => {
      const user = await createUser();
      const role = await createRole();
      const token = generateToken(user);

      const response = await request(app)
        .post('/api/roster/assign')
        .set('Authorization', `Bearer ${token}`)
        .send({
          memberId: user.id,
          roleId: role.id,
          date: format(new Date(), 'yyyy-MM-dd'),
          serviceType: 'english',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should validate frequency rules', async () => {
      const user = await createUser();
      const role = await createRole();
      const token = generateToken(user);

      // Create two existing assignments
      await createAssignment(user.id, role.id);
      await createAssignment(user.id, role.id);

      const response = await request(app)
        .post('/api/roster/assign')
        .set('Authorization', `Bearer ${token}`)
        .send({
          memberId: user.id,
          roleId: role.id,
          date: format(new Date(), 'yyyy-MM-dd'),
          serviceType: 'english',
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toContain('maximum serving frequency');
    });
  });

  describe('GET /api/roster/month/:yearMonth', () => {
    it('should return monthly roster', async () => {
      const user = await createUser();
      const token = generateToken(user);
      const yearMonth = format(new Date(), 'yyyy-MM');

      const response = await request(app)
        .get(`/api/roster/month/${yearMonth}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});