import React, { useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { useAudioStore } from '../store/audioStore';

interface Props {
  onComplete?: () => void;
  isLandscape?: boolean;
  phase?: 'intro' | 'exercise' | 'rest';
}

export const Timer: React.FC<Props> = ({ onComplete, isLandscape = false, phase }) => {
  const { workout, setTimeRemaining, toggleRest, nextExercise, updateExerciseTime } = useWorkoutStore();
  const { playBeep, playLongBeep } = useAudioStore();
  const progressRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const lastBeepTimeRef = useRef<number>(workout.timeRemaining);

  useEffect(() => {
    if (!workout.isActive || workout.isPaused) return;

    let animationFrameId: number;
    
    const updateTimer = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
        lastBeepTimeRef.current = workout.timeRemaining;
      }

      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;
      
      if (workout.timeRemaining > 0) {
        progressRef.current += deltaTime / 1000;
        
        if (progressRef.current >= 1) {
          const secondsToSubtract = Math.floor(progressRef.current);
          const newTimeRemaining = workout.timeRemaining - secondsToSubtract;
          setTimeRemaining(newTimeRemaining);
          
          // Check if we've crossed a second boundary for beeps
          if (lastBeepTimeRef.current > 5 && newTimeRemaining <= 5) {
            playBeep();
          } else if (newTimeRemaining <= 5 && newTimeRemaining > 0 && 
                     Math.floor(lastBeepTimeRef.current) > Math.floor(newTimeRemaining)) {
            playBeep();
          } else if (newTimeRemaining <= 1 && 
                     Math.floor(lastBeepTimeRef.current) > Math.floor(newTimeRemaining)) {
            playLongBeep();
          }
          
          lastBeepTimeRef.current = newTimeRemaining;
          
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
        lastBeepTimeRef.current = workout.timeRemaining;
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

  const getTimerColor = () => {
    if (workout.timeRemaining <= 5) {
      return 'text-red-500 dark:text-red-400 timer-warning';
    }
    return workout.isResting
      ? 'text-green-300 dark:text-green-400'
      : 'text-blue-300 dark:text-blue-400';
  };

  const timerClasses = `font-bold tabular-nums leading-none ${
    isLandscape ? 'text-[120px]' : 'text-[180px] mb-4'
  } ${getTimerColor()}`;

  return (
    <div className={`flex items-center justify-center ${isLandscape ? 'h-full' : ''}`}>
      <div className={timerClasses}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export { Timer }
