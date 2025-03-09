import React, { useState } from 'react';
import { Exercise, WorkoutStats } from '../types';
import { Star, Clock, SkipForward, Dumbbell } from 'lucide-react';

interface Props {
  exercises: Exercise[];
  stats: WorkoutStats;
  onComplete: (exercises: Exercise[], rating?: number, notes?: string) => void;
}

export const SummaryScreen: React.FC<Props> = ({ exercises, stats, onComplete }) => {
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getWorkoutTypeIcon = () => {
    switch (stats.workoutType) {
      case 'cardio':
        return <Clock className="w-6 h-6" />;
      case 'strength':
        return <Dumbbell className="w-6 h-6" />;
      case 'yoga':
        return <Star className="w-6 h-6" />;
      default:
        return <SkipForward className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-indigo-950 p-4 flex items-center justify-center">
      <div className="bg-white dark:bg-indigo-900 rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-indigo-900 dark:text-indigo-100">
          Workout Complete!
        </h2>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getWorkoutTypeIcon()}
              <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                {stats.workoutType.charAt(0).toUpperCase() + stats.workoutType.slice(1)}
              </span>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              {stats.selectedDuration} minute workout
            </p>
          </div>

          <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
              Total Duration
            </h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              {formatTime(stats.totalDuration)}
            </p>
          </div>

          <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
              Exercise Time
            </h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              {formatTime(stats.totalExerciseTime)}
            </p>
          </div>

          <div className="bg-indigo-100 dark:bg-indigo-800 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
              Skipped Exercises
            </h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              {stats.skippedExercises}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-indigo-900 dark:text-indigo-100">
            Rate your workout
          </h3>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`p-2 transition-colors ${
                  rating >= value 
                    ? 'text-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-indigo-900 dark:text-indigo-100">
            Add notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did this workout feel? What would you like to remember for next time?"
            className="w-full p-4 border rounded-lg dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-100 dark:placeholder-indigo-400"
            rows={4}
          />
        </div>

        {/* Complete Button */}
        <button
          onClick={() => onComplete(exercises, rating, notes)}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          Complete Workout
        </button>
      </div>
    </div>
  );
};