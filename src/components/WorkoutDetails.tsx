import React from 'react';
import { format } from 'date-fns';
import { Session } from '../types';
import { X, Star, Heart, PersonStanding, Shuffle, Clock, Dumbbell } from 'lucide-react';

interface Props {
  workouts: Session[];
  onClose: () => void;
  onRepeat: (session: Session) => void;
}

export const WorkoutDetails: React.FC<Props> = ({ workouts, onClose, onRepeat }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio':
        return <Heart className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
      case 'strength':
        return <Dumbbell className="w-6 h-6 text-red-500 dark:text-red-400" />;
      case 'yoga':
        return <PersonStanding className="w-6 h-6 text-green-500 dark:text-green-400" />;
      default:
        return <Shuffle className="w-6 h-6 text-purple-500 dark:text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            Workouts on {format(new Date(workouts[0].created_at), 'PP')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>

        <div className="space-y-6">
          {workouts.map((workout) => (
            <div key={workout.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  {/* Workout Type and Stats */}
                  {workout.stats && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getWorkoutTypeIcon(workout.stats.workoutType)}
                        <span className="text-lg font-medium capitalize dark:text-white">
                          {workout.stats.workoutType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-5 h-5" />
                        <span>{formatTime(workout.stats.totalDuration)}</span>
                      </div>
                    </div>
                  )}

                  {/* Location if available */}
                  {workout.stats?.location && (
                    <div className="text-gray-600 dark:text-gray-400">
                      Location: {workout.stats.location.name}
                    </div>
                  )}

                  {/* Exercise List */}
                  <div className="space-y-2">
                    <h3 className="font-medium dark:text-white">Exercises:</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                      {workout.exercises.map((exercise, index) => (
                        <li key={index}>{exercise.title}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Notes */}
                  {workout.notes && (
                    <div className="text-gray-600 dark:text-gray-400 italic">
                      "{workout.notes}"
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-4">
                  {/* Rating */}
                  {typeof workout.rating === 'number' && workout.rating > 0 && (
                    <div className="flex">
                      {[...Array(workout.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}

                  {/* Repeat Button */}
                  <button
                    onClick={() => onRepeat(workout)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Repeat Workout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
