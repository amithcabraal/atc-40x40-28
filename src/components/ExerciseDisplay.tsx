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
  
  const { speak, cancelSpeech } = useAudioStore();
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
    // Cancel any ongoing announcement when skipping
    cancelSpeech();
    
    const isLastExercise = workout.currentExercise >= workout.exercises.length - 1;

    if (isLastExercise) {
      if (workout.isResting) {
        setShowSummary(true);
      } else {
        incrementSkippedExercises();
        setShowSummary(true);
      }
    } else {
      if (workout.isResting) {
        toggleRest();
      } else {
        incrementSkippedExercises();
        nextExercise();
      }
    }
  };

  const handleShuffle = () => {
    // Cancel any ongoing announcement when shuffling
    cancelSpeech();
    shuffleNextExercise();
  };

  const handleStop = () => {
    setShowStopConfirmation(true);
    pauseWorkout();
  };

  const handleStopConfirm = () => {
    setShowStopConfirmation(false);
    setShowSummary(true);
  };

  const handleStopCancel = () => {
    setShowStopConfirmation(false);
    resumeWorkout();
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

  const buttonOpacity = 'opacity-100';
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
      />

      <div className={`flex-1 flex ${isLandscape ? 'flex-row' : 'flex-col'} px-4 py-2 overflow-hidden relative ${modeBorderStyle}`}>
        {!isLandscape && (
          <Timer 
            onComplete={handleSkip}
            isLandscape={isLandscape}
            phase={workout.isResting ? 'rest' : 'exercise'}
          />
        )}

        <div className="relative flex-1">
          <ExerciseContent
            exercise={currentExercise}
            showOverlay={false}
            overlayOpacityClass=""
            theme={workout.isResting ? 'green' : 'blue'}
            isLandscape={isLandscape}
            isPaused={workout.isPaused}
          />

          {isLandscape && (
            <div className="absolute left-0 top-0 h-[40%] flex items-center justify-center w-1/3">
              <Timer 
                onComplete={handleSkip}
                isLandscape={isLandscape}
                phase={workout.isResting ? 'rest' : 'exercise'}
              />
            </div>
          )}

          <div className={`absolute ${isLandscape ? 'right-0 top-1/2 -translate-y-1/2' : 'bottom-0 left-0 right-0'}`}>
            <Controls
              isPaused={workout.isPaused}
              isResting={workout.isResting}
              buttonOpacity={buttonOpacity}
              onResume={resumeWorkout}
              onPause={pauseWorkout}
              onSkip={handleSkip}
              onShuffle={handleShuffle}
              onStop={handleStop}
              isLandscape={isLandscape}
            />
          </div>
        </div>
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
