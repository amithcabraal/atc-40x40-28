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
          
          if (!workout.isResting && !workout.isIntro) {
            updateExerciseTime(secondsToSubtract);
          }
          
          progressRef.current -= secondsToSubtract;
        }
        
        animationFrameId = requestAnimationFrame(updateTimer);
      } else {
        if (workout.isIntro) {
          if (onComplete) onComplete();
        } else if (workout.isResting) {
          toggleRest();
        } else {
          if (workout.currentExercise >= workout.exercises.length - 1) {
            if (onComplete) onComplete();
          } else {
            nextExercise();
          }
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

  if (isLandscape) {
    return (
      <div className="text-4xl font-bold tabular-nums">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    );
  }

  return (
    <>
      <div className="text-3xl font-bold tabular-nums">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </>
  );
};