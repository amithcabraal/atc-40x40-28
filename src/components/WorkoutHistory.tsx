import React from 'react';
import { format } from 'date-fns';
import { Star, RotateCw } from 'lucide-react';
import { Session } from '../types';

interface Props {
  sessions: Session[];
  onRepeat: (session: Session) => void;
}

export const WorkoutHistory: React.FC<Props> = ({ sessions, onRepeat }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Workout History</h2>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No workout history yet.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {format(new Date(session.created_at), 'PPP')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.exercises.length} exercises
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {session.rating && session.rating > 0 ? (
                    <div className="flex">
                      {[...Array(session.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  ) : null}
                  <button
                    onClick={() => onRepeat(session)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Repeat workout"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};