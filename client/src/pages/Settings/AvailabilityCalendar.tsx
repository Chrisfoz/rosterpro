import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AvailabilityCalendarProps {
  month: Date;
  onMonthChange: (date: Date) => void;
}

interface Availability {
  date: string;
  isAvailable: boolean;
  reason?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ month, onMonthChange }) => {
  const queryClient = useQueryClient();
  
  // Get all days in the current month
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fetch availability data
  const { data: availability = [], isLoading } = useQuery<Availability[]>(
    ['availability', format(month, 'yyyy-MM')],
    async () => {
      const response = await fetch(`/api/availability?month=${format(month, 'yyyy-MM')}`);
      return response.json();
    }
  );

  // Update availability mutation
  const mutation = useMutation(
    async ({ date, isAvailable, reason }: Availability) => {
      await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, isAvailable, reason }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['availability']);
      },
    }
  );

  const toggleAvailability = (date: Date) => {
    const existingAvailability = availability.find(a =>
      isSameDay(new Date(a.date), date)
    );

    mutation.mutate({
      date: format(date, 'yyyy-MM-dd'),
      isAvailable: existingAvailability ? !existingAvailability.isAvailable : false,
    });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(month, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => onMonthChange(new Date(month.setMonth(month.getMonth() - 1)))}
            className="px-3 py-1 border rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => onMonthChange(new Date(month.setMonth(month.getMonth() + 1)))}
            className="px-3 py-1 border rounded-md hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map(day => {
          const dayAvailability = availability.find(a =>
            isSameDay(new Date(a.date), day)
          );
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => toggleAvailability(day)}
              className={`
                p-2 text-center rounded-md hover:bg-gray-50
                ${dayAvailability?.isAvailable === false ? 'bg-red-100' : ''}
                ${dayAvailability?.isAvailable ? 'bg-green-100' : ''}
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-end space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded-sm mr-2" />
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 rounded-sm mr-2" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;