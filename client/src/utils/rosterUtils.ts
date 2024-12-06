interface TeamMember {
  id: number;
  name: string;
  roles: string[];
  languageSkills: {
    english: 'none' | 'basic' | 'fluent';
    italian: 'none' | 'basic' | 'fluent';
  };
}

interface Role {
  id: string;
  name: string;
  category: string;
  maxCapacity?: number;
}

export const validateLanguageRequirement = (
  member: TeamMember,
  serviceType: 'english' | 'italian'
) => {
  return member.languageSkills[serviceType] === 'fluent';
};

export const checkRoleCapacity = (
  role: Role,
  currentAssignments: any[],
  newAssignment: any
) => {
  if (!role.maxCapacity) return true;

  const currentCount = currentAssignments.filter(
    (a) => a.roleId === role.id
  ).length;

  return currentCount < role.maxCapacity;
};

export const getRoleCategories = () => ({
  worship: ['Worship Leader', 'Vocals', 'Guitar', 'Keys', 'Drums', 'Bass'],
  production: ['Sound', 'Video', 'Lights', 'Presentation'],
  service: ['Host', 'Ushers', 'Welcome Team', 'Prayer Team'],
});

export const categorizeRoles = (roles: Role[]) => {
  const categories = getRoleCategories();
  return Object.entries(categories).reduce(
    (acc, [category, roleNames]) => ({
      ...acc,
      [category]: roles.filter((role) => roleNames.includes(role.name)),
    }),
    {}
  );
};

export const validateTeamComposition = (assignments: any[]) => {
  const categories = getRoleCategories();
  
  // Check if worship team has required roles
  const worshipTeam = assignments.filter((a) =>
    categories.worship.includes(a.role.name)
  );
  
  const hasWorshipLeader = worshipTeam.some((a) => a.role.name === 'Worship Leader');
  const hasEnoughVocals = worshipTeam.filter((a) => a.role.name === 'Vocals').length >= 2;
  
  const issues = [];
  if (!hasWorshipLeader) issues.push('Missing Worship Leader');
  if (!hasEnoughVocals) issues.push('Need at least 2 vocalists');
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};
