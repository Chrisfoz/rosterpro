import { Database } from '../utils/db';
import { ValidationError } from '../utils/errors';
import { differenceInWeeks, parseISO } from 'date-fns';

interface RosterAssignment {
  memberId: number;
  roleId: number;
  date: string;
  serviceType: 'english' | 'italian';
}

export class SchedulerService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async createRoster(assignments: RosterAssignment[]) {
    return await this.db.transaction(async (client) => {
      // Validate all assignments
      const validationResults = await this.validateAssignments(assignments);
      if (!validationResults.isValid) {
        throw new ValidationError('Invalid roster assignments', validationResults.conflicts);
      }

      // Create service entries if they don't exist
      for (const assignment of assignments) {
        const { date, serviceType } = assignment;
        await client.query(
          `INSERT INTO services (date, service_type, start_time, end_time)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (date, service_type) DO NOTHING`,
          [date, serviceType, '09:00', '10:30'] // Default times
        );
      }

      // Create roster assignments
      const results = [];
      for (const assignment of assignments) {
        const { memberId, roleId, date, serviceType } = assignment;
        const result = await client.query(
          `INSERT INTO rosters (user_id, role_id, service_id, status)
           SELECT $1, $2, s.id, 'scheduled'
           FROM services s
           WHERE s.date = $3 AND s.service_type = $4
           RETURNING *`,
          [memberId, roleId, date, serviceType]
        );
        results.push(result.rows[0]);
      }

      return results;
    });
  }

  async validateAssignments(assignments: RosterAssignment[]) {
    const conflicts = [];

    for (const assignment of assignments) {
      // Check serving frequency
      const frequencyConflict = await this.checkServingFrequency(assignment);
      if (frequencyConflict) conflicts.push(frequencyConflict);

      // Check role conflicts
      const roleConflict = await this.checkRoleConflicts(assignment);
      if (roleConflict) conflicts.push(roleConflict);

      // Check capacity limits
      const capacityConflict = await this.checkCapacityLimits(assignment);
      if (capacityConflict) conflicts.push(capacityConflict);

      // Check language requirements
      const languageConflict = await this.checkLanguageRequirements(assignment);
      if (languageConflict) conflicts.push(languageConflict);

      // Check family preferences
      const familyConflict = await this.checkFamilyPreferences(assignment);
      if (familyConflict) conflicts.push(familyConflict);
    }

    return {
      isValid: conflicts.length === 0,
      conflicts
    };
  }

  private async checkServingFrequency(assignment: RosterAssignment) {
    const { memberId, date } = assignment;
    
    const result = await this.db.query(
      `SELECT COUNT(*) as serve_count
       FROM rosters r
       JOIN services s ON r.service_id = s.id
       WHERE r.user_id = $1
       AND s.date >= $2 - INTERVAL '28 days'
       AND s.date <= $2`,
      [memberId, date]
    );

    const serveCount = parseInt(result.rows[0].serve_count);
    if (serveCount >= 2) {
      return {
        type: 'frequency',
        message: 'Member has already served twice in the past 4 weeks'
      };
    }
  }

  private async checkRoleConflicts(assignment: RosterAssignment) {
    const { memberId, roleId, date } = assignment;
    
    const result = await this.db.query(
      `SELECT r.*, ro.name as role_name
       FROM rosters r
       JOIN services s ON r.service_id = s.id
       JOIN roles ro ON r.role_id = ro.id
       WHERE r.user_id = $1
       AND s.date = $2
       AND r.role_id != $3`,
      [memberId, date, roleId]
    );

    if (result.rows.length > 0) {
      return {
        type: 'role_conflict',
        message: `Already assigned to ${result.rows[0].role_name} on this date`
      };
    }
  }

  private async checkCapacityLimits(assignment: RosterAssignment) {
    const { roleId, date, serviceType } = assignment;
    
    const result = await this.db.query(
      `SELECT r.*, ro.max_capacity
       FROM rosters r
       JOIN services s ON r.service_id = s.id
       JOIN roles ro ON r.role_id = ro.id
       WHERE r.role_id = $1
       AND s.date = $2
       AND s.service_type = $3`,
      [roleId, date, serviceType]
    );

    if (result.rows.length > 0 && result.rows[0].max_capacity <= result.rows.length) {
      return {
        type: 'capacity',
        message: 'Maximum capacity reached for this role'
      };
    }
  }

  private async checkLanguageRequirements(assignment: RosterAssignment) {
    const { memberId, serviceType } = assignment;
    
    const result = await this.db.query(
      `SELECT language_skills
       FROM users
       WHERE id = $1`,
      [memberId]
    );

    const languageSkills = result.rows[0].language_skills;
    if (languageSkills[serviceType] !== 'fluent') {
      return {
        type: 'language',
        message: `Insufficient ${serviceType} language skills`
      };
    }
  }

  private async checkFamilyPreferences(assignment: RosterAssignment) {
    const { memberId, date } = assignment;
    
    // Check if member is young (12-16) and has family serving preference
    const result = await this.db.query(
      `SELECT sp.preference_value, u.date_of_birth
       FROM serving_preferences sp
       JOIN users u ON sp.user_id = u.id
       WHERE u.id = $1 AND sp.preference_type = 'family_serve_together'`,
      [memberId]
    );

    if (result.rows.length > 0 && result.rows[0].preference_value.enabled) {
      const familyResult = await this.db.query(
        `SELECT COUNT(*) as family_count
         FROM rosters r
         JOIN services s ON r.service_id = s.id
         JOIN family_relationships fr ON (fr.user1_id = r.user_id OR fr.user2_id = r.user_id)
         WHERE (fr.user1_id = $1 OR fr.user2_id = $1)
         AND s.date = $2`,
        [memberId, date]
      );

      if (familyResult.rows[0].family_count === 0) {
        return {
          type: 'family',
          message: 'Member prefers to serve with family members'
        };
      }
    }
  }
}
