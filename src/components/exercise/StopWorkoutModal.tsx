import React from 'react';
import { X } from 'lucide-react';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export const StopWorkoutModal: React.FC<Props> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Stop Workout?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to stop this workout? Your progress will still be saved.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Yes, Stop
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            No, Continue
          </button>
        </div>
      </div>
    </div>
  );
};