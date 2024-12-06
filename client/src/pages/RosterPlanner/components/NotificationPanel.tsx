import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Notification {
  id: number;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

const NotificationPanel: React.FC = () => {
  const { data: notifications, isLoading } = useQuery<Notification[]>(
    ['notifications'],
    () => fetch('/api/notifications').then((res) => res.json())
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>

      <div className="space-y-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-md ${
                notification.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : notification.type === 'warning'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <p className="text-sm">{notification.message}</p>
              <span className="text-xs opacity-75">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;