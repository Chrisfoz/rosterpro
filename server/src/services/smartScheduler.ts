import { Database } from '../utils/db';
import { ValidationError } from '../utils/errors';
import { SchedulerService } from './schedulerService';
import { AvailabilityService } from './availabilityService';
import { NotificationService } from './notificationService';

interface ScheduleRequest {
  date: string;
  serviceType: 'english' | 'italian';
  roles: number[];
}

interface Assignment {
  memberId: number;
  roleId: number;
  score: number;
}

export class SmartScheduler {
  private db: Database;
  private schedulerService: SchedulerService;
  private availabilityService: AvailabilityService;
  private notificationService: NotificationService;

  constructor(
    db: Database,
    schedulerService: SchedulerService,
    availabilityService: AvailabilityService,
    notificationService: NotificationService
  ) {
    this.db = db;
    this.schedulerService = schedulerService;
    this.availabilityService = availabilityService;
    this.notificationService = notificationService;
  }

  async generateOptimalSchedule(request: ScheduleRequest) {
    const { date, serviceType, roles } = request;

    // Get all available members for each role
    const roleAssignments = await Promise.all(
      roles.map(async (roleId) => {
        const availableMembers = await this.availabilityService.getAvailableMembers(date, roleId);
        const scoredAssignments = await this.scoreCandidates(roleId, availableMembers, date, serviceType);
        return this.selectBestCandidate(scoredAssignments, roleId);
      })
    );

    // Validate the complete schedule
    const assignments = roleAssignments.filter(a => a !== null).map(a => ({
      memberId: a!.memberId,
      roleId: a!.roleId,
      date,
      serviceType
    }));

    const validationResult = await this.schedulerService.validateAssignments(assignments);
    if (!validationResult.isValid) {
      throw new ValidationError('Invalid schedule generated', validationResult.conflicts);
    }

    // Create the roster assignments
    const roster = await this.schedulerService.createRoster(assignments);

    // Send notifications
    await Promise.all(
      assignments.map(async (assignment) => {
        const role = await this.getRoleName(assignment.roleId);
        await this.notificationService.notifyRosterAssignment(
          assignment.memberId,
          assignment.date,
          role
        );
      })
    );

    return roster;
  }

  private async scoreCandidates(
    roleId: number,
    members: any[],
    date: string,
    serviceType: string
  ): Promise<Assignment[]> {
    const scoredAssignments: Assignment[] = [];

    for (const member of members) {
      let score = 0;

      // Check skill level for the role
      const skillLevel = await this.getMemberSkillLevel(member.id, roleId);
      score += skillLevel * 2;

      // Check recent serving history
      const recentServings = await this.getRecentServings(member.id, date);
      score -= recentServings.length * 3;

      // Check language proficiency
      const languageScore = await this.getLanguageScore(member.id, serviceType);
      score += languageScore * 2;

      // Check role preferences
      if (await this.isPreferredRole(member.id, roleId)) {
        score += 5;
      }

      // Family serving preference bonus
      if (await this.hasFamilyMemberServing(member.id, date)) {
        score += 3;
      }

      scoredAssignments.push({
        memberId: member.id,
        roleId,
        score
      });
    }

    return scoredAssignments;
  }

  private selectBestCandidate(assignments: Assignment[], roleId: number): Assignment | null {
    if (assignments.length === 0) return null;
    return assignments.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  }

  private async getRoleName(roleId: number): Promise<string> {
    const result = await this.db.queryOne(
      'SELECT name FROM roles WHERE id = $1',
      [roleId]
    );
    return result?.name;
  }

  private async getMemberSkillLevel(memberId: number, roleId: number): Promise<number> {
    const result = await this.db.queryOne(
      'SELECT skill_level FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [memberId, roleId]
    );
    return result?.skill_level || 0;
  }

  private async getRecentServings(memberId: number, date: string): Promise<any[]> {
    const result = await this.db.query(
      `SELECT * FROM rosters r
       JOIN services s ON r.service_id = s.id
       WHERE r.user_id = $1
       AND s.date >= $2::date - interval '28 days'
       AND s.date < $2::date`,
      [memberId, date]
    );
    return result.rows;
  }

  private async getLanguageScore(memberId: number, serviceType: string): Promise<number> {
    const result = await this.db.queryOne(
      'SELECT language_skills FROM users WHERE id = $1',
      [memberId]
    );
    const skills = result?.language_skills || {};
    const level = skills[serviceType];
    return level === 'fluent' ? 5 : level === 'basic' ? 2 : 0;
  }

  private async isPreferredRole(memberId: number, roleId: number): Promise<boolean> {
    const result = await this.db.queryOne(
      'SELECT is_preferred FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [memberId, roleId]
    );
    return result?.is_preferred || false;
  }

  private async hasFamilyMemberServing(memberId: number, date: string): Promise<boolean> {
    const result = await this.db.queryOne(
      `SELECT COUNT(*) as count
       FROM rosters r
       JOIN services s ON r.service_id = s.id
       JOIN family_relationships f ON 
         (f.user1_id = $1 AND f.user2_id = r.user_id) OR
         (f.user2_id = $1 AND f.user1_id = r.user_id)
       WHERE s.date = $2`,
      [memberId, date]
    );
    return (result?.count || 0) > 0;
  }
}
