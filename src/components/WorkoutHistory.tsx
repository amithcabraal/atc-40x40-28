import React from 'react';
import { format } from 'date-fns';
import { Star, RotateCw, Clock, Dumbbell, SkipForward } from 'lucide-react';
import { Session } from '../types';

interface Props {
  sessions: Session[];
  onRepeat: (session: Session) => void;
}

export const WorkoutHistory: React.FC<Props> = ({ sessions, onRepeat }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Workout History</h2>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No workout history yet.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {format(new Date(session.created_at), 'PPP')}
                  </p>
                  
                  {/* Workout Type and Duration */}
                  {session.stats && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        <span className="capitalize">{session.stats.workoutType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(session.stats.totalDuration)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Exercise Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{session.exercises.length} exercises</span>
                    {session.stats && (
                      <div className="flex items-center gap-1">
                        <SkipForward className="w-4 h-4" />
                        <span>{session.stats.skippedExercises} skipped</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes */}
                  {session.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{session.notes}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  {typeof session.rating === 'number' && session.rating > 0 ? (
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
