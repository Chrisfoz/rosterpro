import fs from 'fs/promises';
import path from 'path';
import { pool } from '../../config/database';

async function migrate() {
  const client = await pool.connect();

  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations'
    );
    const executedMigrationNames = executedMigrations.map((row) => row.name);

    // Read migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter((f) => f.endsWith('.sql')).sort();

    // Execute new migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Executing migration: ${file}`);

        const migrationPath = path.join(migrationsDir, file);
        const sql = await fs.readFile(migrationPath, 'utf8');

        await client.query('BEGIN');

        try {
          await client.query(sql);
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`Migration ${file} completed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Error executing migration ${file}:`, error);
          throw error;
        }
      }
    }
  } finally {
    client.release();
  }
}

// Execute migrations if this file is run directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migrations completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
