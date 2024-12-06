import { pool } from '../config/database';
import { differenceInWeeks } from 'date-fns';

interface ValidationRule {
  name: string;
  validate: (assignment: any, context: any) => Promise<{
    isValid: boolean;
    message?: string;
  }>;
}

const validationRules: ValidationRule[] = [
  {
    name: 'Maximum Serving Frequency',
    async validate(assignment, context) {
      const { memberId, date } = assignment;
      
      // Check previous assignments in the last 4 weeks
      const result = await pool.query(
        `SELECT COUNT(*) as serve_count
         FROM rosters
         WHERE user_id = $1
         AND service_date >= $2
         AND service_date <= $3`,
        [memberId, new Date(date).toISOString(), new Date(date).toISOString()]
      );

      const serveCount = parseInt(result.rows[0].serve_count);
      return {
        isValid: serveCount < 2,
        message: serveCount >= 2 ? 'Member has already served twice this month' : undefined
      };
    }
  },
  {
    name: 'Role Conflict Check',
    async validate(assignment, context) {
      const { memberId, date, roleId } = assignment;
      
      // Check for existing assignments on the same day
      const result = await pool.query(
        `SELECT r.*, ro.name as role_name
         FROM rosters r
         JOIN roles ro ON r.role_id = ro.id
         WHERE r.user_id = $1
         AND r.service_date = $2
         AND r.role_id != $3`,
        [memberId, date, roleId]
      );

      return {
        isValid: result.rows.length === 0,
        message: result.rows.length > 0 
          ? `Already assigned to ${result.rows[0].role_name} on this date`
          : undefined
      };
    }
  },
  {
    name: 'Capacity Check',
    async validate(assignment, context) {
      const { date, serviceType } = assignment;
      
      // Check current stage capacity
      const result = await pool.query(
        `SELECT COUNT(*) as stage_count
         FROM rosters r
         JOIN roles ro ON r.role_id = ro.id
         WHERE r.service_date = $1
         AND r.service_type = $2
         AND ro.category = 'stage'`,
        [date, serviceType]
      );

      const stageCount = parseInt(result.rows[0].stage_count);
      return {
        isValid: stageCount < 10,
        message: stageCount >= 10 ? 'Maximum stage capacity reached' : undefined
      };
    }
  },
  {
    name: 'Language Requirement Check',
    async validate(assignment, context) {
      const { memberId, serviceType } = assignment;
      
      // Check language skills
      const result = await pool.query(
        `SELECT language_skills
         FROM users
         WHERE id = $1`,
        [memberId]
      );

      const languageSkills = result.rows[0].language_skills;
      const requiredLanguage = serviceType.toLowerCase();
      
      return {
        isValid: languageSkills[requiredLanguage] === 'fluent',
        message: languageSkills[requiredLanguage] !== 'fluent' 
          ? `Insufficient ${requiredLanguage} language skills`
          : undefined
      };
    }
  },
  {
    name: 'Family Grouping Check',
    async validate(assignment, context) {
      const { memberId, date } = assignment;
      
      // Check for young members (12-16) and their family preferences
      const result = await pool.query(
        `SELECT sp.preference_value, u.date_of_birth
         FROM serving_preferences sp
         JOIN users u ON sp.user_id = u.id
         WHERE u.id = $1 AND sp.preference_type = 'family_serve_together'`,
        [memberId]
      );

      if (result.rows.length > 0) {
        const age = calculateAge(result.rows[0].date_of_birth);
        if (age >= 12 && age <= 16) {
          // Check if any family member is serving
          const familyResult = await pool.query(
            `SELECT COUNT(*) as family_count
             FROM rosters r
             JOIN family_relationships fr ON (fr.user1_id = r.user_id OR fr.user2_id = r.user_id)
             WHERE (fr.user1_id = $1 OR fr.user2_id = $1)
             AND r.service_date = $2`,
            [memberId, date]
          );

          return {
            isValid: familyResult.rows[0].family_count > 0,
            message: familyResult.rows[0].family_count === 0 
              ? 'Young member should serve with family'
              : undefined
          };
        }
      }

      return { isValid: true };
    }
  }
];

export async function validateRosterRules(assignments: any[]) {
  const context = {
    date: assignments[0]?.date,
    serviceType: assignments[0]?.serviceType
  };

  const validationResults = [];

  for (const assignment of assignments) {
    for (const rule of validationRules) {
      const result = await rule.validate(assignment, context);
      if (!result.isValid) {
        validationResults.push({
          rule: rule.name,
          message: result.message,
          assignment
        });
      }
    }
  }

  return {
    isValid: validationResults.length === 0,
    conflicts: validationResults
  };
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}