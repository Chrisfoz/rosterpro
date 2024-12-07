import { Database } from '../utils/db';
import { ValidationError } from '../utils/errors';

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  languageSkills: {
    english: 'none' | 'basic' | 'fluent';
    italian: 'none' | 'basic' | 'fluent';
  };
}

interface Role {
  id: number;
  name: string;
  category: string;
  maxCapacity?: number;
  requiresTraining: boolean;
}

export class TeamService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async addTeamMember(member: TeamMember) {
    return await this.db.transaction(async (client) => {
      // Check for existing email
      const existingMember = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [member.email]
      );

      if (existingMember.rows.length > 0) {
        throw new ValidationError('Email already registered');
      }

      // Insert new member
      const result = await client.query(
        `INSERT INTO users (
          first_name,
          last_name,
          email,
          phone,
          language_skills
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          member.firstName,
          member.lastName,
          member.email,
          member.phone,
          JSON.stringify(member.languageSkills),
        ]
      );

      return result.rows[0];
    });
  }

  async updateTeamMember(id: number, updates: Partial<TeamMember>) {
    const setClause = [];
    const values = [];
    let valueCount = 1;

    if (updates.firstName) {
      setClause.push(`first_name = $${valueCount}`);
      values.push(updates.firstName);
      valueCount++;
    }

    if (updates.lastName) {
      setClause.push(`last_name = $${valueCount}`);
      values.push(updates.lastName);
      valueCount++;
    }

    if (updates.email) {
      setClause.push(`email = $${valueCount}`);
      values.push(updates.email);
      valueCount++;
    }

    if (updates.phone) {
      setClause.push(`phone = $${valueCount}`);
      values.push(updates.phone);
      valueCount++;
    }

    if (updates.languageSkills) {
      setClause.push(`language_skills = $${valueCount}`);
      values.push(JSON.stringify(updates.languageSkills));
      valueCount++;
    }

    if (setClause.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${setClause.join(', ')}
      WHERE id = $${valueCount}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async assignRole(userId: number, roleId: number, skillLevel: number) {
    return await this.db.query(
      `INSERT INTO user_roles (user_id, role_id, skill_level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, role_id)
       DO UPDATE SET skill_level = $3
       RETURNING *`,
      [userId, roleId, skillLevel]
    );
  }

  async removeRole(userId: number, roleId: number) {
    // Check if member has future assignments for this role
    const futureAssignments = await this.db.query(
      `SELECT r.*, s.date
       FROM rosters r
       JOIN services s ON r.service_id = s.id
       WHERE r.user_id = $1
       AND r.role_id = $2
       AND s.date > CURRENT_DATE`,
      [userId, roleId]
    );

    if (futureAssignments.rows.length > 0) {
      throw new ValidationError(
        'Cannot remove role with future assignments',
        futureAssignments.rows
      );
    }

    return await this.db.query(
      'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [userId, roleId]
    );
  }

  async getMemberRoles(userId: number) {
    const result = await this.db.query(
      `SELECT r.*, ur.skill_level
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  async updateFamilyRelationship(
    user1Id: number,
    user2Id: number,
    relationship: string
  ) {
    return await this.db.query(
      `INSERT INTO family_relationships (user1_id, user2_id, relationship_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user1_id, user2_id)
       DO UPDATE SET relationship_type = $3
       RETURNING *`,
      [user1Id, user2Id, relationship]
    );
  }

  async getFamilyMembers(userId: number) {
    const result = await this.db.query(
      `SELECT u.*, fr.relationship_type
       FROM users u
       JOIN family_relationships fr ON 
         (fr.user1_id = $1 AND fr.user2_id = u.id) OR
         (fr.user2_id = $1 AND fr.user1_id = u.id)`,
      [userId]
    );
    return result.rows;
  }

  async searchMembers(query: string) {
    const searchPattern = `%${query}%`;
    const result = await this.db.query(
      `SELECT *
       FROM users
       WHERE first_name ILIKE $1
          OR last_name ILIKE $1
          OR email ILIKE $1
       ORDER BY first_name, last_name`,
      [searchPattern]
    );
    return result.rows;
  }

  async getTeamStats() {
    const stats = await this.db.query(`
      SELECT
        COUNT(DISTINCT u.id) as total_members,
        COUNT(DISTINCT ur.role_id) as total_roles,
        COUNT(DISTINCT r.id) as total_assignments,
        (
          SELECT COUNT(*)
          FROM users u2
          WHERE u2.language_skills->>'english' = 'fluent'
        ) as english_speakers,
        (
          SELECT COUNT(*)
          FROM users u3
          WHERE u3.language_skills->>'italian' = 'fluent'
        ) as italian_speakers
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN rosters r ON u.id = r.user_id
    `);

    return stats.rows[0];
  }
}
