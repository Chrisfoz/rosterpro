import { pool } from '../config/database';

beforeAll(async () => {
  // Setup test database
  await pool.query(`
    CREATE TABLE IF NOT EXISTS test_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

beforeEach(async () => {
  // Clean up test data
  await pool.query('BEGIN');
});

afterEach(async () => {
  // Rollback test data
  await pool.query('ROLLBACK');
});

afterAll(async () => {
  // Close database connection
  await pool.end();
});
