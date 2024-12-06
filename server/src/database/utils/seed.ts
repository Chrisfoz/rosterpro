import fs from 'fs/promises';
import path from 'path';
import { pool } from '../../config/database';

async function seed() {
  const client = await pool.connect();

  try {
    // Create seeds table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS seeds (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed seeds
    const { rows: executedSeeds } = await client.query('SELECT name FROM seeds');
    const executedSeedNames = executedSeeds.map((row) => row.name);

    // Read seed files
    const seedsDir = path.join(__dirname, '..', 'seeds');
    const files = await fs.readdir(seedsDir);
    const seedFiles = files.filter((f) => f.endsWith('.sql')).sort();

    // Execute new seeds
    for (const file of seedFiles) {
      if (!executedSeedNames.includes(file)) {
        console.log(`Executing seed: ${file}`);

        const seedPath = path.join(seedsDir, file);
        const sql = await fs.readFile(seedPath, 'utf8');

        await client.query('BEGIN');

        try {
          await client.query(sql);
          await client.query('INSERT INTO seeds (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`Seed ${file} completed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Error executing seed ${file}:`, error);
          throw error;
        }
      }
    }
  } finally {
    client.release();
  }
}

// Execute seeds if this file is run directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeds completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
