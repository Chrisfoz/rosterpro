import { faker } from '@faker-js/faker';
import { pool } from '../../config/database';

export const createRole = async (overrides = {}) => {
  const defaultData = {
    name: faker.person.jobTitle(),
    category: faker.helpers.arrayElement(['worship', 'production', 'service']),
    maxCapacity: faker.number.int({ min: 1, max: 10 }),
    requiresTraining: faker.datatype.boolean(),
  };

  const roleData = { ...defaultData, ...overrides };

  const result = await pool.query(
    `INSERT INTO roles (
      name,
      category,
      max_capacity,
      requires_training
    ) VALUES ($1, $2, $3, $4) RETURNING *`,
    [
      roleData.name,
      roleData.category,
      roleData.maxCapacity,
      roleData.requiresTraining,
    ]
  );

  return result.rows[0];
};

export const createAssignment = async (userId: number, roleId: number, date = new Date()) => {
  const result = await pool.query(
    `INSERT INTO rosters (
      user_id,
      role_id,
      service_date,
      service_type,
      status
    ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, roleId, date, 'english', 'scheduled']
  );

  return result.rows[0];
};

export const createAvailability = async (userId: number, date: Date) => {
  const result = await pool.query(
    `INSERT INTO availability (
      user_id,
      date,
      is_available,
      reason
    ) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, date, false, 'Test unavailability']
  );

  return result.rows[0];
};