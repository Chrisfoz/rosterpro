import { format, differenceInWeeks } from 'date-fns';

export interface ValidationRule {
  id: string;
  name: string;
  validate: (assignment: any, context: any) => {
    isValid: boolean;
    message?: string;
  };
}

export const validationRules: ValidationRule[] = [
  {
    id: 'max-frequency',
    name: 'Maximum Serving Frequency',
    validate: (assignment, context) => {
      const { member, date } = assignment;
      const { previousAssignments } = context;
      
      // Check if member has served more than twice in the past 4 weeks
      const recentAssignments = previousAssignments.filter(
        (a: any) =>
          a.memberId === member.id &&
          differenceInWeeks(new Date(date), new Date(a.date)) <= 4
      );

      return {
        isValid: recentAssignments.length < 2,
        message:
          recentAssignments.length >= 2
            ? `${member.name} has already served twice in the past 4 weeks`
            : undefined,
      };
    },
  },
  {
    id: 'role-conflict',
    name: 'Role Conflict Check',
    validate: (assignment, context) => {
      const { member, role, date } = assignment;
      const { currentAssignments } = context;
      
      // Check if member is already assigned to another role on the same day
      const existingAssignment = currentAssignments.find(
        (a: any) =>
          a.memberId === member.id &&
          a.date === date &&
          a.roleId !== role.id
      );

      return {
        isValid: !existingAssignment,
        message: existingAssignment
          ? `${member.name} is already assigned to ${existingAssignment.role.name} on this date`
          : undefined,
      };
    },
  },
  {
    id: 'capacity-limit',
    name: 'Stage Capacity Check',
    validate: (assignment, context) => {
      const { role } = assignment;
      const { currentAssignments } = context;
      
      // Check if adding this assignment would exceed the stage capacity
      const stageRoles = ['Worship Leader', 'Vocals', 'Guitar', 'Keys', 'Drums'];
      if (stageRoles.includes(role.name)) {
        const currentStageCount = currentAssignments.filter((a: any) =>
          stageRoles.includes(a.role.name)
        ).length;

        return {
          isValid: currentStageCount < 10,
          message:
            currentStageCount >= 10
              ? 'Maximum stage capacity (10) would be exceeded'
              : undefined,
        };
      }

      return { isValid: true };
    },
  },
];

export const validateAssignment = (
  assignment: any,
  context: any
) => {
  const results = validationRules.map(rule => ({
    ruleId: rule.id,
    ...rule.validate(assignment, context)
  }));

  return {
    isValid: results.every(r => r.isValid),
    conflicts: results.filter(r => !r.isValid)
  };
};
