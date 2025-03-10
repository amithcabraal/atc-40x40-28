import React, { useState, useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
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
  
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentExercise = workout.exercises[workout.currentExercise];
  const progress = ((workout.currentExercise + 1) / workout.exercises.length) * 100;

  // Check if the device is in landscape mode
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

  // Set up the overlay fade timer
  useEffect(() => {
    setShowOverlay(true);
    
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
    }
    
    const hasMedia = currentExercise?.media && currentExercise.media.length > 0;
    
    if (hasMedia) {
      overlayTimerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 5000);
    }
    
    return () => {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
    };
  }, [workout.currentExercise, workout.isResting, currentExercise]);

  const handleComplete = (exercises: Exercise[], rating?: number, notes?: string) => {
    const endTime = Date.now();
    const totalDuration = Math.floor((endTime - workout.startTime!) / 1000);

    const stats = {
      totalDuration,
      skippedExercises: workout.skippedExercises,
      totalExerciseTime: workout.totalExerciseTime,
      workoutType: workout.workoutType,
      selectedDuration: workout.selectedDuration
    };

    onComplete(exercises, rating, notes);
    stopWorkout();
    localStorage.removeItem('workoutState');
  };

  const handleSkip = () => {
    const isLastExercise = workout.currentExercise >= workout.exercises.length - 1;

    if (isLastExercise) {
      if (workout.isResting) {
        // If in rest mode of last exercise, show summary
        setShowSummary(true);
      } else {
        // If in exercise mode of last exercise, count as skipped and show summary
        incrementSkippedExercises();
        setShowSummary(true);
      }
    } else {
      if (workout.isResting) {
        // If in rest mode, go to exercise mode of current exercise
        toggleRest();
      } else {
        // If in exercise mode, count as skipped and go to rest mode of next exercise
        incrementSkippedExercises();
        nextExercise();
      }
    }
  };

  const handleStop = () => {
    setShowStopConfirmation(true);
    pauseWorkout(); // Pause the workout while showing confirmation
  };

  const handleStopConfirm = () => {
    setShowStopConfirmation(false);
    setShowSummary(true);
  };

  const handleStopCancel = () => {
    setShowStopConfirmation(false);
    resumeWorkout(); // Resume the workout if user cancels
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
    
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }
    
    if (!showOverlay) {
      const hasMedia = currentExercise?.media && currentExercise.media.length > 0;
      
      if (hasMedia) {
        overlayTimerRef.current = setTimeout(() => {
          setShowOverlay(false);
        }, 5000);
      }
    }
  };

  if (workout.isIntro) {
    return <IntroView onComplete={completeIntro} isResuming={workout.isResuming} />;
  }

  if (showSummary || !workout.isActive) {
    return (
      <SummaryScreen 
        exercises={workout.exercises}
        stats={{
          totalDuration: Math.floor((Date.now() - workout.startTime!) / 1000),
          skippedExercises: workout.skippedExercises,
          totalExerciseTime: workout.totalExerciseTime,
          workoutType: workout.workoutType,
          selectedDuration: workout.selectedDuration
        }}
        onComplete={handleComplete}
      />
    );
  }

  const currentExerciseHasMedia = currentExercise?.media && currentExercise.media.length > 0;
  const shouldAllowOverlayFade = currentExerciseHasMedia;
  const overlayOpacityClass = shouldAllowOverlayFade 
    ? (showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none') 
    : 'opacity-100';
  const buttonOpacity = showOverlay ? 'opacity-100' : 'opacity-40 hover:opacity-100';
  const modeBorderStyle = workout.isResting
    ? 'border-8 border-green-500 dark:border-green-400 animate-pulse-slow'
    : 'border-8 border-blue-500 dark:border-blue-400';

  return (
    <div className={`flex flex-col h-screen ${
      workout.isResting 
        ? 'bg-green-50 dark:bg-green-950 bg-gradient-to-b from-green-200 to-green-50 dark:from-green-900 dark:to-green-950' 
        : 'bg-blue-50 dark:bg-blue-950 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-950'
    } transition-colors duration-300`}>
      <StatusBar
        isResting={workout.isResting}
        currentExercise={workout.currentExercise}
        totalExercises={workout.exercises.length}
        progress={progress}
        isLandscape={isLandscape}
      >
        <Timer 
          onComplete={handleSkip} 
          isLandscape={isLandscape}
          phase={workout.isResting ? 'rest' : 'exercise'} 
        />
      </StatusBar>

      <div className={`flex-1 flex flex-col px-4 py-2 overflow-hidden relative ${modeBorderStyle}`}>
        <ExerciseContent
          exercise={currentExercise}
          showOverlay={showOverlay}
          overlayOpacityClass={overlayOpacityClass}
          theme={workout.isResting ? 'green' : 'blue'}
          isLandscape={isLandscape}
          isPaused={workout.isPaused}
        />
      </div>

      <div className={`w-full ${
        workout.isResting
          ? 'bg-green-200 dark:bg-green-800'
          : 'bg-blue-200 dark:bg-blue-800'
      } p-4 transition-colors duration-300`}>
        <Controls
          isPaused={workout.isPaused}
          isResting={workout.isResting}
          showOverlay={showOverlay}
          shouldAllowOverlayFade={shouldAllowOverlayFade}
          buttonOpacity={buttonOpacity}
          onResume={resumeWorkout}
          onPause={pauseWorkout}
          onSkip={handleSkip}
          onToggleOverlay={toggleOverlay}
          onShuffle={shuffleNextExercise}
          onStop={handleStop}
          isLandscape={isLandscape}
        />
      </div>

      {showStopConfirmation && (
        <StopWorkoutModal
          onConfirm={handleStopConfirm}
          onCancel={handleStopCancel}
        />
      )}
    </div>
  );
};