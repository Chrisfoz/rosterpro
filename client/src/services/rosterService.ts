import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface RosterValidationResult {
  isValid: boolean;
  conflicts: {
    type: string;
    message: string;
  }[];
}

export const rosterService = {
  // Fetch roster for a specific date and service
  async getRoster(date: string, serviceType: string) {
    const response = await axios.get(`${API_URL}/rosters`, {
      params: { date, serviceType },
    });
    return response.data;
  },

  // Validate roster assignments against rules
  async validateAssignments(assignments: any): Promise<RosterValidationResult> {
    const response = await axios.post(`${API_URL}/rosters/validate`, assignments);
    return response.data;
  },

  // Save roster assignments
  async saveRoster(date: string, serviceType: string, assignments: any) {
    const response = await axios.post(`${API_URL}/rosters`, {
      date,
      serviceType,
      assignments,
    });
    return response.data;
  },

  // Get available team members for a specific date and role
  async getAvailableMembers(date: string, roleId: string) {
    const response = await axios.get(`${API_URL}/members/available`, {
      params: { date, roleId },
    });
    return response.data;
  },

  // Update member availability
  async updateAvailability(memberId: number, date: string, isAvailable: boolean) {
    const response = await axios.post(`${API_URL}/members/${memberId}/availability`, {
      date,
      isAvailable,
    });
    return response.data;
  },
};