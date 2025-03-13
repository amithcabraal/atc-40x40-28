import React, { useState, useEffect } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { useAudioStore } from '../store/audioStore';
import { Timer } from './Timer';
import { Exercise } from '../types';
import { IntroView } from './IntroView';
import { SummaryScreen } from './SummaryScreen';
import { StatusBar } from './exercise/StatusBar';
import { Controls } from './exercise/Controls';
import { ExerciseContent } from './exercise/ExerciseContent';
import { StopWorkoutModal } from './exercise/StopWorkoutModal';

interface Props {
  onComplete: (exercises: Exercise[], rating?: number, notes?: string) => void;
}

export const ExerciseDisplay: React.FC<Props> = ({ onComplete }) => {
  const { 
    workout, 
    pauseWorkout, 
    resumeWorkout, 
    stopWorkout, 
    nextExercise, 
    toggleRest, 
    shuffleNextExercise,
    completeIntro,
    incrementSkippedExercises,
    updateExerciseTime 
  } = useWorkoutStore();
  
  const { speak } = useAudioStore();
  const [isLandscape, setIsLandscape] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  
  const currentExercise = workout.exercises[workout.currentExercise];
  const progress = ((workout.currentExercise + 1) / workout.exercises.length) * 100;

  // Announce next exercise when entering rest mode
  useEffect(() => {
    if (workout.isResting && !workout.isPaused) {
      speak(`Next up... ${currentExercise.title}`);
    }
  }, [workout.isResting, currentExercise.title, workout.isPaused]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  // ... rest of the component remains the same ...

  return (
    <div className={`flex flex-col h-screen ${
      workout.isResting 
        ? 'bg-green-50 dark:bg-green-950 bg-gradient-to-b from-green-200 to-green-50 dark:from-green-900 dark:to-green-950' 
        : 'bg-blue-50 dark:bg-blue-950 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-950'
    } transition-all duration-500`}>
      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
};
