import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface TeamPanelProps {
  date: Date;
  serviceType: string;
}

interface TeamMember {
  id: number;
  name: string;
  roles: string[];
  availability: boolean;
}

const TeamPanel: React.FC<TeamPanelProps> = ({ date, serviceType }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Fetch team members
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>(
    ['teamMembers', date, serviceType],
    () => fetch('/api/team-members').then((res) => res.json())
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Team Assignment - {format(date, 'MMMM d, yyyy')}
      </h2>

      {/* Role Selector */}
      <div className="mb-4">
        <select
          className="w-full rounded-md border-gray-300 shadow-sm"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="worship">Worship</option>
          <option value="sound">Sound</option>
          <option value="video">Video</option>
        </select>
      </div>

      {/* Team Members List */}
      <div className="space-y-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          teamMembers?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span>{member.name}</span>
              <button className="text-indigo-600 hover:text-indigo-900">
                Assign
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamPanel;