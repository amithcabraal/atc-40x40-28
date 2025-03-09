import React, { useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/workoutStore';

interface Props {
  onComplete?: () => void;
  isLandscape?: boolean;
  phase?: 'intro' | 'exercise' | 'rest';
}

export const Timer: React.FC<Props> = ({ onComplete, isLandscape = false, phase }) => {
  const { workout, setTimeRemaining, toggleRest, nextExercise, updateExerciseTime } = useWorkoutStore();
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
        progressRef.current += deltaTime / 1000;
        
        if (progressRef.current >= 1) {
          const secondsToSubtract = Math.floor(progressRef.current);
          setTimeRemaining(workout.timeRemaining - secondsToSubtract);
          
          // Update exercise time if we're in exercise phase
          if (!workout.isResting && !workout.isIntro) {
            updateExerciseTime(secondsToSubtract);
          }
          
          progressRef.current -= secondsToSubtract;
        }
        
        animationFrameId = requestAnimationFrame(updateTimer);
      } else {
        if (workout.isIntro && onComplete) {
          onComplete();
        } else if (workout.isResting) {
          if (workout.currentExercise >= workout.exercises.length - 1) {
            if (onComplete) onComplete();
          } else {
            nextExercise();
          }
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
  }, [workout.timeRemaining, workout.isResting, workout.isActive, workout.isPaused, workout.isIntro]);

  const minutes = Math.floor(workout.timeRemaining / 60);
  const seconds = workout.timeRemaining % 60;
  
  const totalTime = workout.isIntro ? 20 : (workout.isResting ? 20 : 40);
  const progress = (workout.timeRemaining / totalTime) * 100;

  // Get phase-specific styles
  const getPhaseStyles = () => {
    if (workout.isIntro || phase === 'intro') {
      return {
        text: 'text-purple-700 dark:text-purple-300',
        bg: 'bg-purple-500/20 dark:bg-purple-400/20'
      };
    }
    if (workout.isResting || phase === 'rest') {
      return {
        text: 'text-green-700 dark:text-green-300',
        bg: 'bg-green-500/30 dark:bg-green-400/30'
      };
    }
    return {
      text: 'text-blue-700 dark:text-blue-300',
      bg: 'bg-blue-500/30 dark:bg-blue-400/30'
    };
  };

  const styles = getPhaseStyles();

  if (isLandscape) {
    return (
      <div className={`text-4xl font-bold tabular-nums ${styles.text}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    );
  }

  return (
    <div className="w-full h-[13.33vh] relative">
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${styles.bg} ${
            (workout.isIntro || workout.isResting) ? 'animate-pulse' : ''
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-[10vh] font-bold tabular-nums tracking-tight ${styles.text}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="absolute bottom-1 right-2">
        <span className={`text-xs font-bold uppercase ${styles.text}`}>
          {workout.isIntro ? 'Get Ready' : (workout.isResting ? 'Rest' : 'Exercise')}
        </span>
      </div>
    </div>
  );
};
