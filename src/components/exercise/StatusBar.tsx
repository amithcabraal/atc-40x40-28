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
            MyFitnessTimer
          </h1>
          
          <div className="flex items-center">
            <p className="text-sm font-medium">
              {currentExercise + 1} / {totalExercises}
            </p>
          </div>
        </div>

        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
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
        <div className="h-12 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {currentExercise + 1}/{totalExercises}
            </span>
          </div>

          <h1 className="text-base font-bold truncate mx-2">
            MyFitnessTimer
          </h1>

          <div className="flex items-center">
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              isResting
                ? 'bg-green-500/20 text-green-100'
                : 'bg-blue-500/20 text-blue-100'
            }`}>
              {isResting ? 'REST' : 'EXERCISE'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
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
