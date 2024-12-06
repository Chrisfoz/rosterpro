import { useQuery } from '@tanstack/react-query';

export const useTeamMembers = (roleId?: string, date?: string) => {
  return useQuery(
    ['teamMembers', roleId, date],
    async () => {
      const params = new URLSearchParams();
      if (roleId) params.append('roleId', roleId);
      if (date) params.append('date', date);

      const response = await fetch(`/api/members/available?${params.toString()}`);
      return response.json();
    },
    {
      enabled: !!roleId && !!date,
    }
  );
};
