import React, { useState } from 'react';
import Calendar from './components/Calendar';
import TeamPanel from './components/TeamPanel';
import NotificationPanel from './components/NotificationPanel';
import RosterView from './components/RosterView';

const RosterPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<string>('english');

  return (
    <div className="h-full grid grid-cols-12 gap-4">
      {/* Left Panel - Calendar */}
      <div className="col-span-3 bg-white rounded-lg shadow">
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onServiceSelect={setSelectedService}
        />
      </div>

      {/* Middle Panel - Team Assignment */}
      <div className="col-span-6 bg-white rounded-lg shadow">
        <TeamPanel 
          date={selectedDate}
          serviceType={selectedService}
        />
      </div>

      {/* Right Panel - Notifications */}
      <div className="col-span-3 bg-white rounded-lg shadow">
        <NotificationPanel />
      </div>

      {/* Bottom Panel - Generated Roster */}
      <div className="col-span-12 bg-white rounded-lg shadow mt-4">
        <RosterView 
          date={selectedDate}
          serviceType={selectedService}
        />
      </div>
    </div>
  );
};

export default RosterPlanner;