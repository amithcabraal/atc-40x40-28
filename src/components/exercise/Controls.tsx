import React from 'react';
import { Play, Pause, SkipForward, Info, Shuffle, X } from 'lucide-react';

interface ControlsProps {
  isPaused: boolean;
  isResting: boolean;
  showOverlay: boolean;
  shouldAllowOverlayFade: boolean;
  buttonOpacity: string;
  onResume: () => void;
  onPause: () => void;
  onSkip: () => void;
  onToggleOverlay: () => void;
  onShuffle: () => void;
  onStop: () => void;
  isLandscape?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isPaused,
  isResting,
  showOverlay,
  shouldAllowOverlayFade,
  buttonOpacity,
  onResume,
  onPause,
  onSkip,
  onToggleOverlay,
  onShuffle,
  onStop,
  isLandscape
}) => {
  const buttonClasses = isLandscape
    ? 'h-12 w-12 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform'
    : 'p-4 rounded-full transition-transform hover:scale-105';

  return (
    <div className={isLandscape 
      ? "absolute right-6 top-[25%] transform -translate-y-1/4 z-20 flex flex-col space-y-3"
      : "flex justify-center space-x-4"
    }>
      {isPaused ? (
        <button
          onClick={onResume}
          className={`${buttonClasses} bg-green-500 text-white hover:bg-green-600 ${buttonOpacity}`}
          title="Resume"
        >
          <Play className={isLandscape ? "w-5 h-5" : "w-5 h-5"} />
        </button>
      ) : (
        <button
          onClick={onPause}
          className={`${buttonClasses} bg-yellow-500 text-white hover:bg-yellow-600 ${buttonOpacity}`}
          title="Pause"
        >
          <Pause className={isLandscape ? "w-5 h-5" : "w-5 h-5"} />
        </button>
      )}
      
      <button
        onClick={onSkip}
        className={`${buttonClasses} bg-blue-500 text-white hover:bg-blue-600 ${buttonOpacity}`}
        title="Skip to next"
      >
        <SkipForward className={isLandscape ? "w-5 h-5" : "w-5 h-5"} />
      </button>
      
      <button
        onClick={onToggleOverlay}
        className={`${buttonClasses} ${
          showOverlay 
            ? 'bg-purple-500 hover:bg-purple-600' 
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white ${buttonOpacity}`}
        title={showOverlay ? "Hide details" : "Show details"}
        disabled={!shouldAllowOverlayFade}
        style={{ opacity: shouldAllowOverlayFade ? 1 : 0.5, cursor: shouldAllowOverlayFade ? 'pointer' : 'not-allowed' }}
      >
        <Info className={isLandscape ? "w-5 h-5" : "w-5 h-5"} />
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
        <Shuffle className={isLandscape ? "w-5 h-5" : "w-5 h-5"} />
      </button>

      <button
        onClick={onStop}
        className={`${buttonClasses} bg-red-500 text-white hover:bg-red-600 ${buttonOpacity}`}
        title="Stop workout"
      >
        <X className={isLandscape ? "w-5 h-5" : "w-5 h-5"} />
      </button>
    </div>
  );
};