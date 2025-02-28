import React from 'react';
import { Play, RefreshCw } from 'lucide-react';

interface Props {
  onResume: () => void;
  onStartNew: () => void;
  onClose: () => void;
}

export const ResumeWorkoutModal: React.FC<Props> = ({ onResume, onStartNew, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Resume Workout?</h2>
        <p className="mb-6 dark:text-gray-300">
          You have an unfinished workout. Would you like to resume where you left off or start a new workout?
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onResume}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Resume Workout
          </button>
          <button
            onClick={onStartNew}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Start New Workout
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
