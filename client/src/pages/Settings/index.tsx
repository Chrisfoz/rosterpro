import React, { useState } from 'react';
import PreferencesForm from './PreferencesForm';
import AvailabilityCalendar from './AvailabilityCalendar';

const Settings: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Settings & Preferences
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your serving preferences and availability.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <PreferencesForm />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Availability Calendar
            </h3>
            <AvailabilityCalendar
              month={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;