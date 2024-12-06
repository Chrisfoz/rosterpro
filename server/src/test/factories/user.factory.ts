import { faker } from '@faker-js/faker';
import { pool } from '../../config/database';

export const createUser = async (overrides = {}) => {
  const defaultData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    languageSkills: {
      english: 'fluent',
      italian: 'basic',
    },
  };

  const userData = { ...defaultData, ...overrides };

  const result = await pool.query(
    `INSERT INTO users (
      first_name,
      last_name,
      email,
      password_hash,
      phone,
      language_skills
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password, // In real tests, this would be hashed
      userData.phone,
      JSON.stringify(userData.languageSkills),
    ]
  );

  return result.rows[0];
};
