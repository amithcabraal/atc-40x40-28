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
  isLandscape,
  children
}) => {
  const statusBarStyle = isResting
    ? 'bg-green-600 dark:bg-green-700 text-white'
    : 'bg-blue-600 dark:bg-blue-700 text-white';

  return (
    <>
      <div className={`w-full ${isLandscape ? 'py-1' : 'py-2'} px-4 ${statusBarStyle} flex justify-between items-center shadow-md z-20`}>
        <div className="flex items-center">
          <div className={`${isLandscape ? 'px-2 py-0.5 text-sm' : 'px-3 py-1'} rounded-md font-bold ${
            isResting
              ? 'bg-green-200 text-green-800'
              : 'bg-blue-200 text-blue-800'
          }`}>
            {isResting ? 'REST MODE' : 'EXERCISE MODE'}
          </div>
        </div>
        
        <h1 className={`${isLandscape ? 'text-base' : 'text-lg'} font-bold text-white`}>
          Quick Workout
        </h1>
        
        <div className="flex items-center space-x-2">
          {children}
          <p className={`${isLandscape ? 'text-sm' : ''} font-medium`}>
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
};