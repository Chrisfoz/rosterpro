import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../components/notifications/NotificationProvider';
import { useRosterValidation } from './useRosterValidation';

export const useRosterOperations = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const { validateAssignment } = useRosterValidation();

  // Fetch roster data
  const fetchRoster = useCallback(async ({ date, serviceType }: any) => {
    const response = await fetch(
      `/api/roster?date=${date}&serviceType=${serviceType}`
    );
    return response.json();
  }, []);

  // Assign member mutation
  const assignMember = useMutation(
    async ({ memberId, roleId, date, serviceType }: any) => {
      const response = await fetch('/api/roster/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, roleId, date, serviceType }),
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roster']);
        addNotification({
          type: 'success',
          message: 'Member assigned successfully',
        });
      },
      onError: () => {
        addNotification({
          type: 'error',
          message: 'Failed to assign member',
        });
      },
    }
  );

  // Remove member mutation
  const removeMember = useMutation(
    async ({ assignmentId }: any) => {
      const response = await fetch(`/api/roster/remove/${assignmentId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roster']);
        addNotification({
          type: 'success',
          message: 'Member removed successfully',
        });
      },
      onError: () => {
        addNotification({
          type: 'error',
          message: 'Failed to remove member',
        });
      },
    }
  );

  // Handle assignment with validation
  const handleAssignment = useCallback(
    async (assignment: any) => {
      const isValid = await validateAssignment(assignment);
      if (isValid) {
        await assignMember.mutateAsync(assignment);
        return true;
      }
      return false;
    },
    [assignMember, validateAssignment]
  );

  // Export roster to file
  const exportRoster = useCallback(async ({ date, serviceType }: any) => {
    try {
      const response = await fetch(
        `/api/roster/export?date=${date}&serviceType=${serviceType}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roster-${date}-${serviceType}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        message: 'Roster exported successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to export roster',
      });
    }
  }, [addNotification]);

  // Return all the operations
  return {
    fetchRoster,
    handleAssignment,
    removeMember,
    exportRoster,
    assignMember,
  };
};