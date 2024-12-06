import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface RosterViewProps {
  date: Date;
  serviceType: string;
}

interface RosterEntry {
  id: number;
  role: string;
  member: {
    id: number;
    name: string;
  };
  status: 'confirmed' | 'pending' | 'unavailable';
}

const RosterView: React.FC<RosterViewProps> = ({ date, serviceType }) => {
  const { data: roster, isLoading } = useQuery<RosterEntry[]>(
    ['roster', date, serviceType],
    () => fetch(`/api/roster?date=${date}&service=${serviceType}`).then((res) => res.json())
  );

  const roleCategories = [
    { name: 'Worship', roles: ['Worship Leader', 'Vocals', 'Guitar', 'Keys', 'Drums'] },
    { name: 'Production', roles: ['Sound', 'Video', 'Lights'] },
    { name: 'Service', roles: ['Host', 'Ushers', 'Welcome Team'] },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Roster - {format(date, 'MMMM d, yyyy')} ({serviceType})
        </h2>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Export
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Publish
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading roster...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {roleCategories.map((category) => (
            <div key={category.name} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-semibold mb-3">{category.name}</h3>
              <div className="space-y-2">
                {category.roles.map((role) => {
                  const assignment = roster?.find((r) => r.role === role);
                  return (
                    <div
                      key={role}
                      className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                    >
                      <div>
                        <span className="font-medium">{role}</span>
                        {assignment && (
                          <span
                            className={`ml-2 text-sm ${{
                              confirmed: 'text-green-600',
                              pending: 'text-yellow-600',
                              unavailable: 'text-red-600',
                            }[assignment.status]}`}
                          >
                            {assignment.member.name}
                          </span>
                        )}
                      </div>
                      {!assignment && (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RosterView;