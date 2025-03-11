import React from 'react';

interface StatusBarProps {
  isResting: boolean;
  currentExercise: number;
  totalExercises: number;
  progress: number;
  isLandscape?: boolean;
  children?: React.ReactNode;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isResting,
  currentExercise,
  totalExercises,
  progress,
  isLandscape
}) => {
  const statusBarStyle = isResting
    ? 'bg-green-600 dark:bg-green-700 text-white'
    : 'bg-blue-600 dark:bg-blue-700 text-white';

  if (isLandscape) {
    return (
      <>
        <div className={`w-full py-1 px-4 ${statusBarStyle} flex justify-between items-center shadow-md z-20`}>
          <div className="flex items-center">
            <div className="px-2 py-0.5 text-sm rounded-md font-bold bg-green-200 text-green-800">
              {isResting ? 'REST MODE' : 'EXERCISE MODE'}
            </div>
          </div>
          
          <h1 className="text-lg font-bold text-white">
            Quick Workout
          </h1>
          
          <div className="flex items-center">
            <p className="text-sm font-medium">
              {currentExercise + 1} / {totalExercises}
            </p>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full transition-all duration-300 ${
              isResting
                ? 'bg-green-500 dark:bg-green-400'
                : 'bg-blue-500 dark:bg-blue-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`w-full ${statusBarStyle} shadow-md z-20`}>
        <div className="grid grid-cols-3 gap-4 px-4 py-2">
          {/* Mode */}
          <div className="flex flex-col items-start justify-center">
            <div className={`text-sm font-medium ${
              isResting
                ? 'text-green-200'
                : 'text-blue-200'
            }`}>
              {isResting ? 'REST' : 'EXERCISE'}
            </div>
            <div className="font-bold">
              MODE
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col items-end justify-center">
            <div className="text-sm font-medium">
              {currentExercise + 1}
            </div>
            <div className="font-bold">
              / {totalExercises}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700">
        <div 
          className={`h-full transition-all duration-300 ${
            isResting
              ? 'bg-green-500 dark:bg-green-400'
              : 'bg-blue-500 dark:bg-blue-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
};
