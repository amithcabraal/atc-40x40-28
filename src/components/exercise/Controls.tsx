import React from 'react';
import { Play, Pause, SkipForward, Shuffle, X } from 'lucide-react';

interface ControlsProps {
  isPaused: boolean;
  isResting: boolean;
  buttonOpacity: string;
  onResume: () => void;
  onPause: () => void;
  onSkip: () => void;
  onShuffle: () => void;
  onStop: () => void;
  isLandscape?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isPaused,
  isResting,
  buttonOpacity,
  onResume,
  onPause,
  onSkip,
  onShuffle,
  onStop,
  isLandscape
}) => {
  const buttonClasses = isLandscape
    ? 'h-10 w-10 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform'
    : 'p-4 rounded-full transition-transform hover:scale-105';

  return (
    <div className={isLandscape 
      ? "absolute right-4 top-[50%] transform -translate-y-1/2 z-20 flex flex-col space-y-2"
      : "flex justify-center space-x-4"
    }>
      {isPaused ? (
        <button
          onClick={onResume}
          className={`${buttonClasses} bg-green-500 text-white hover:bg-green-600 ${buttonOpacity}`}
          title="Resume"
        >
          <Play className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={onPause}
          className={`${buttonClasses} bg-yellow-500 text-white hover:bg-yellow-600 ${buttonOpacity}`}
          title="Pause"
        >
          <Pause className="w-4 h-4" />
        </button>
      )}
      
      <button
        onClick={onSkip}
        className={`${buttonClasses} bg-blue-500 text-white hover:bg-blue-600 ${buttonOpacity}`}
        title="Skip to next"
      >
        <SkipForward className="w-4 h-4" />
      </button>
      
      <button
        onClick={onShuffle}
        disabled={!isResting}
        className={`${buttonClasses} ${
          isResting
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        } ${buttonOpacity}`}
        title={isResting ? "Shuffle next exercise" : "Can only shuffle during rest"}
      >
        <Shuffle className="w-4 h-4" />
      </button>

      <button
        onClick={onStop}
        className={`${buttonClasses} bg-red-500 text-white hover:bg-red-600 ${buttonOpacity}`}
        title="Stop workout"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
