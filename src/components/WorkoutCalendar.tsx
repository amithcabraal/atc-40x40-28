import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { Session } from '../types';
import { WorkoutDetails } from '../components/WorkoutDetails';

interface Props {
  sessions: Session[];
  onRepeat: (session: Session) => void;
}

export const WorkoutCalendar: React.FC<Props> = ({ sessions, onRepeat }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const getWorkoutsForDay = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.created_at);
      return isSameDay(sessionDate, date);
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, index) => {
            const workouts = getWorkoutsForDay(day);
            const hasWorkout = workouts.length > 0;
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div
                key={index}
                onClick={() => hasWorkout && setSelectedDate(day)}
                className={`aspect-square p-2 relative cursor-pointer transition-colors ${
                  isCurrentMonth
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-600'
                } ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : hasWorkout
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    : ''
                }`}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {hasWorkout && (
                  <div className="absolute bottom-1 right-1">
                    <Dumbbell className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <WorkoutDetails
          workouts={getWorkoutsForDay(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onRepeat={onRepeat}
        />
      )}
    </>
  );
};
