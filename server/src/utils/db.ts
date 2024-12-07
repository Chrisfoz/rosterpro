import { Pool, PoolClient } from 'pg';

type TransactionCallback<T> = (client: PoolClient) => Promise<T>;

export class Database {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async query(sql: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      return await client.query(sql, params);
    } finally {
      client.release();
    }
  }

  async queryOne(sql: string, params?: any[]) {
    const result = await this.query(sql, params);
    return result.rows[0];
  }

  async queryExists(sql: string, params?: any[]): Promise<boolean> {
    const result = await this.query(sql, params);
    return result.rowCount > 0;
  }
}
