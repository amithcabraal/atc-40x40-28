import React, { useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/workoutStore';

interface Props {
  onComplete?: () => void;
  isLandscape?: boolean;
}

export const Timer: React.FC<Props> = ({ onComplete, isLandscape = false }) => {
  const { workout, setTimeRemaining, toggleRest, nextExercise } = useWorkoutStore();
  const progressRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!workout.isActive || workout.isPaused) return;

    let animationFrameId: number;
    
    const updateTimer = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
      }

      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;
      
      if (workout.timeRemaining > 0) {
        progressRef.current += deltaTime / 1000; // Convert to seconds
        
        if (progressRef.current >= 1) {
          const secondsToSubtract = Math.floor(progressRef.current);
          setTimeRemaining(workout.timeRemaining - secondsToSubtract);
          progressRef.current -= secondsToSubtract;
        }
        
        animationFrameId = requestAnimationFrame(updateTimer);
      } else {
        // Timer reached zero
        if (workout.isIntro && onComplete) {
          // If we're in intro mode and timer reaches zero, call onComplete
          onComplete();
          lastUpdateRef.current = 0;
          progressRef.current = 0;
          return;
        } else if (workout.isResting) {
          if (workout.currentExercise >= workout.exercises.length - 1) {
            if (onComplete) {
              onComplete();
            }
            return;
          }
          nextExercise();
        } else {
          toggleRest();
        }
        lastUpdateRef.current = 0;
        progressRef.current = 0;
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [workout.timeRemaining, workout.isResting, workout.isActive, workout.isPaused, workout.isIntro, onComplete]);

  const minutes = Math.floor(workout.timeRemaining / 60);
  const seconds = workout.timeRemaining % 60;
  
  // Calculate progress percentage for the bar
  // Use the appropriate total time based on the current state
  const totalTime = workout.isIntro ? 20 : (workout.isResting ? 20 : 40);
  const progress = (workout.timeRemaining / totalTime) * 100;

  // Landscape mode timer (compact)
  if (isLandscape) {
    return (
      <div className={`text-4xl font-bold tabular-nums ${
        workout.isIntro
          ? 'text-purple-700 dark:text-purple-300'
          : workout.isResting
            ? 'text-green-700 dark:text-green-300'
            : 'text-blue-700 dark:text-blue-300'
      }`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    );
  }

  // Portrait mode timer (with progress bar)
  return (
    <div className="w-full h-[20vh] relative">
      {/* Progress bar background */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all duration-100 ${
            workout.isIntro
              ? 'bg-purple-500/20 dark:bg-purple-400/20 animate-pulse'
              : workout.isResting
                ? 'bg-green-500/20 dark:bg-green-400/20 animate-pulse'
                : 'bg-blue-500/20 dark:bg-blue-400/20'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Timer text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-[15vh] font-bold tabular-nums tracking-tight ${
          workout.isIntro
            ? 'text-purple-700 dark:text-purple-300'
            : workout.isResting
              ? 'text-green-700 dark:text-green-300'
              : 'text-blue-700 dark:text-blue-300'
        }`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};
