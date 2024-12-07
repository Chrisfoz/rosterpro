import { Database } from '../utils/db';
import { NotificationService } from './notificationService';

interface Override {
  userId: number;
  roleId: number;
  date: string;
  reason: string;
  approvedBy: number;
}

export class ExceptionHandler {
  private db: Database;
  private notificationService: NotificationService;

  constructor(db: Database, notificationService: NotificationService) {
    this.db = db;
    this.notificationService = notificationService;
  }

  async createOverride(override: Override) {
    return await this.db.transaction(async (client) => {
      // Record the override
      const result = await client.query(
        `INSERT INTO roster_overrides
         (user_id, role_id, date, reason, approved_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [override.userId, override.roleId, override.date, override.reason, override.approvedBy]
      );

      // Notify relevant team members
      await this.notificationService.createNotification({
        userId: override.userId,
        type: 'override_created',
        title: 'Schedule Override Created',
        message: `An override has been created for your schedule on ${override.date}`
      });

      return result.rows[0];
    });
  }

  async handleEmergencySubstitution({
    originalUserId,
    newUserId,
    roleId,
    date,
    reason
  }: {
    originalUserId: number;
    newUserId: number;
    roleId: number;
    date: string;
    reason: string;
  }) {
    return await this.db.transaction(async (client) => {
      // Update the roster assignment
      await client.query(
        `UPDATE rosters r
         SET user_id = $1
         FROM services s
         WHERE r.service_id = s.id
         AND r.user_id = $2
         AND r.role_id = $3
         AND s.date = $4`,
        [newUserId, originalUserId, roleId, date]
      );

      // Record the substitution
      await client.query(
        `INSERT INTO roster_substitutions
         (original_user_id, new_user_id, role_id, date, reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [originalUserId, newUserId, roleId, date, reason]
      );

      // Notify affected members
      await Promise.all([
        this.notificationService.createNotification({
          userId: originalUserId,
          type: 'substitution_out',
          title: 'Schedule Substitution',
          message: `You have been substituted out for ${date}`
        }),
        this.notificationService.createNotification({
          userId: newUserId,
          type: 'substitution_in',
          title: 'Emergency Substitution',
          message: `You have been assigned as a substitute for ${date}`
        })
      ]);
    });
  }

  async recordBlockoutDate(userId: number, date: string, reason: string) {
    // Record the blockout date
    await this.db.query(
      `INSERT INTO blockout_dates (user_id, date, reason)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date)
       DO UPDATE SET reason = $3`,
      [userId, date, reason]
    );

    // Check and handle any existing assignments
    const conflicts = await this.db.query(
      `SELECT r.*, s.date, ro.name as role_name
       FROM rosters r
       JOIN services s ON r.service_id = s.id
       JOIN roles ro ON r.role_id = ro.id
       WHERE r.user_id = $1 AND s.date = $2`,
      [userId, date]
    );

    if (conflicts.rows.length > 0) {
      await this.notificationService.createNotification({
        userId,
        type: 'blockout_conflict',
        title: 'Schedule Conflict',
        message: `You have existing assignments on ${date} that need to be reassigned`
      });
    }

    return { conflicts: conflicts.rows };
  }

  async getOverrides(date: string) {
    const result = await this.db.query(
      `SELECT o.*, u.first_name, u.last_name, r.name as role_name
       FROM roster_overrides o
       JOIN users u ON o.user_id = u.id
       JOIN roles r ON o.role_id = r.id
       WHERE o.date = $1`,
      [date]
    );
    return result.rows;
  }

  async getSubstitutionHistory(userId: number) {
    const result = await this.db.query(
      `SELECT s.*, r.name as role_name,
              u1.first_name as original_first_name,
              u1.last_name as original_last_name,
              u2.first_name as new_first_name,
              u2.last_name as new_last_name
       FROM roster_substitutions s
       JOIN roles r ON s.role_id = r.id
       JOIN users u1 ON s.original_user_id = u1.id
       JOIN users u2 ON s.new_user_id = u2.id
       WHERE s.original_user_id = $1 OR s.new_user_id = $1
       ORDER BY s.date DESC`,
      [userId]
    );
    return result.rows;
  }

  async getBlockoutDates(userId: number, startDate: string, endDate: string) {
    const result = await this.db.query(
      `SELECT *
       FROM blockout_dates
       WHERE user_id = $1
       AND date >= $2
       AND date <= $3
       ORDER BY date`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }
}
