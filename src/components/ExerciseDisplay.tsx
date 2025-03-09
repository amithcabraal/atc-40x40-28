import React, { useState, useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { Timer } from './Timer';
import { Play, Pause, Square, Star, SkipForward, Shuffle, Info } from 'lucide-react';
import { Exercise, WorkoutStats } from '../types';
import { MediaGallery } from './MediaGallery';
import { IntroView } from './IntroView';
import { BodyPartIcons } from './BodyPartIcons';
import { SummaryScreen } from './SummaryScreen';

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
    incrementSkippedExercises 
  } = useWorkoutStore();
  
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentExercise = workout.exercises[workout.currentExercise];
  const nextExerciseData = workout.exercises[workout.currentExercise + 1];
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
    
    const hasMedia = workout.isResting 
      ? nextExerciseData?.media && nextExerciseData.media.length > 0
      : currentExercise?.media && currentExercise.media.length > 0;
    
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
  }, [workout.currentExercise, workout.isResting, currentExercise, nextExerciseData]);

  const handleComplete = (exercises: Exercise[], rating?: number, notes?: string) => {
    const endTime = Date.now();
    const totalDuration = Math.floor((endTime - workout.startTime!) / 1000);

    const stats: WorkoutStats = {
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
    if (workout.currentExercise >= workout.exercises.length - 1) {
      const endTime = Date.now();
      const totalDuration = Math.floor((endTime - workout.startTime!) / 1000);

      const stats: WorkoutStats = {
        totalDuration,
        skippedExercises: workout.skippedExercises,
        totalExerciseTime: workout.totalExerciseTime,
        workoutType: workout.workoutType,
        selectedDuration: workout.selectedDuration
      };

      handleComplete(workout.exercises);
    } else {
      incrementSkippedExercises();
      if (workout.isResting) {
        nextExercise();
      } else {
        toggleRest();
      }
    }
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
    
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = null;
    }
    
    if (!showOverlay) {
      const hasMedia = workout.isResting 
        ? nextExerciseData?.media && nextExerciseData.media.length > 0
        : currentExercise?.media && currentExercise.media.length > 0;
      
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

  if (!workout.isActive) return null;

  // Check if current exercise or next exercise has media
  const currentExerciseHasMedia = currentExercise?.media && currentExercise.media.length > 0;
  const nextExerciseHasMedia = nextExerciseData?.media && nextExerciseData.media.length > 0;
  
  // Determine if overlay should be able to fade out
  const shouldAllowOverlayFade = workout.isResting ? nextExerciseHasMedia : currentExerciseHasMedia;
  
  // Determine overlay opacity class
  const overlayOpacityClass = shouldAllowOverlayFade 
    ? (showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none') 
    : 'opacity-100';

  // Button opacity based on overlay visibility
  const buttonOpacity = showOverlay ? 'opacity-100' : 'opacity-40 hover:opacity-100';

  // Enhanced border styles for better visual differentiation
  const modeBorderStyle = workout.isResting
    ? 'border-8 border-green-500 dark:border-green-400 animate-pulse-slow'
    : 'border-8 border-blue-500 dark:border-blue-400';

  // Status bar styles
  const statusBarStyle = workout.isResting
    ? 'bg-green-600 dark:bg-green-700 text-white'
    : 'bg-blue-600 dark:bg-blue-700 text-white';

  // Portrait mode layout
  if (!isLandscape) {
    return (
      <div className={`flex flex-col h-screen ${
        workout.isResting 
          ? 'bg-green-50 dark:bg-green-950 bg-gradient-to-b from-green-200 to-green-50 dark:from-green-900 dark:to-green-950' 
          : 'bg-blue-50 dark:bg-blue-950 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-950'
      } transition-colors duration-300`}>
        {/* Status Bar */}
        <div className={`w-full py-2 px-4 ${statusBarStyle} flex justify-between items-center shadow-md z-20`}>
          <div className="flex items-center">
            <div className={`px-3 py-1 rounded-md font-bold ${
              workout.isResting
                ? 'bg-green-200 text-green-800'
                : 'bg-blue-200 text-blue-800'
            }`}>
              {workout.isResting ? 'REST MODE' : 'EXERCISE MODE'}
            </div>
          </div>
          
          <h1 className="text-lg font-bold text-white">Workout Timer</h1>
          
          <p className="font-medium">
            {workout.currentExercise + 1} / {workout.exercises.length}
          </p>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full transition-all duration-300 ${
              workout.isResting
                ? 'bg-green-500 dark:bg-green-400'
                : 'bg-blue-500 dark:bg-blue-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <Timer onComplete={handleSkip} phase={workout.isResting ? 'rest' : 'exercise'} />

        <div className={`flex-1 flex flex-col px-4 py-2 overflow-hidden relative ${modeBorderStyle}`}>
          {workout.isResting ? (
            <div className="relative h-full">
              {nextExerciseHasMedia && (
                <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
                  <MediaGallery 
                    media={nextExerciseData.media} 
                    theme="green"
                    hideControls={!showOverlay}
                  />
                </div>
              )}
              
              <div 
                className={`absolute inset-0 z-10 p-4 bg-gradient-to-b from-green-200/90 to-green-100/80 dark:from-green-900/90 dark:to-green-800/80 rounded-lg transition-opacity duration-500 flex flex-col ${overlayOpacityClass}`}
              >
                <div className="@container">
                  <h3 className="text-green-800 dark:text-green-200 text-balance font-bold mb-4 vertical-align-top
                    text-[51px] leading-[1.1]">
                    Next: {nextExerciseData?.title}
                  </h3>
                  
                  <p className="text-green-700 dark:text-green-300 flex-shrink-0 mb-4
                    text-[34px] leading-[1.2]">
                    {nextExerciseData?.instructions}
                  </p>
                </div>
                
                {nextExerciseData?.body_part_focus && (
                  <div className="mt-auto flex justify-between items-center flex-shrink-0">
                    <BodyPartIcons 
                      bodyParts={nextExerciseData.body_part_focus} 
                      theme="green"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              {currentExerciseHasMedia && (
                <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
                  <MediaGallery 
                    media={currentExercise.media}
                    theme="blue"
                    hideControls={!showOverlay}
                  />
                </div>
              )}
              
              <div 
                className={`absolute inset-0 z-10 p-4 bg-gradient-to-b from-blue-200/90 to-blue-100/80 dark:from-blue-900/90 dark:to-blue-800/80 rounded-lg transition-opacity duration-500 flex flex-col ${overlayOpacityClass}`}
              >
                <div className="@container">
                  <h1 className="text-blue-800 dark:text-blue-200 text-balance font-bold mb-4 vertical-align-top
                    text-[51px] leading-[1.1]">
                    {currentExercise.title}
                  </h1>
                  
                  <p className="text-blue-700 dark:text-blue-300 flex-shrink-0 mb-4
                    text-[34px] leading-[1.2]">
                    {currentExercise.instructions}
                  </p>
                </div>
                
                {currentExercise?.body_part_focus && (
                  <div className="mt-auto flex-shrink-0">
                    <BodyPartIcons 
                      bodyParts={currentExercise.body_part_focus} 
                      theme="blue"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`w-full ${
          workout.isResting
            ? 'bg-green-200 dark:bg-green-800'
            : 'bg-blue-200 dark:bg-blue-800'
        } p-4 transition-colors duration-300`}>
          <div className="flex justify-center space-x-4">
            {workout.isPaused ? (
              <button
                onClick={resumeWorkout}
                className={`p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-transform hover:scale-105 ${buttonOpacity}`}
              >
                <Play size={24} />
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className={`p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-transform hover:scale-105 ${buttonOpacity}`}
              >
                <Pause size={24} />
              </button>
            )}
            <button
              onClick={handleSkip}
              className={`p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform hover:scale-105 ${buttonOpacity}`}
              title="Skip to next"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={toggleOverlay}
              className={`p-4 ${
                showOverlay 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white rounded-full transition-transform hover:scale-105 ${buttonOpacity}`}
              title={showOverlay ? "Hide details" : "Show details"}
              disabled={!shouldAllowOverlayFade}
              style={{ opacity: shouldAllowOverlayFade ? 1 : 0.5, cursor: shouldAllowOverlayFade ? 'pointer' : 'not-allowed' }}
            >
              <Info size={24} />
            </button>
            <button
              onClick={shuffleNextExercise}
              disabled={!workout.isResting}
              className={`p-4 ${
                workout.isResting
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              } rounded-full transition-transform ${workout.isResting ? 'hover:scale-105' : ''} ${buttonOpacity}`}
              title={workout.isResting ? "Shuffle next exercise" : "Can only shuffle during rest"}
            >
              <Shuffle size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Landscape mode layout
  return (
    <div className={`flex flex-col h-screen ${
      workout.isResting 
        ? 'bg-green-50 dark:bg-green-950' 
        : 'bg-blue-50 dark:bg-blue-950'
    } transition-colors duration-300`}>
      <div className={`w-full py-1 px-4 ${statusBarStyle} flex justify-between items-center shadow-md z-20`}>
        <div className="flex items-center">
          <div className={`px-2 py-0.5 rounded-md text-sm font-bold ${
            workout.isResting
              ? 'bg-green-200 text-green-800'
              : 'bg-blue-200 text-blue-800'
          }`}>
            {workout.isResting ? 'REST MODE' : 'EXERCISE MODE'}
          </div>
        </div>
        
        <h1 className="text-base font-bold text-white">Workout Timer</h1>
        
        <div className="flex items-center space-x-2">
          <Timer onComplete={handleSkip} isLandscape={true} phase={workout.isResting ? 'rest' : 'exercise'} />
          <p className="text-sm font-medium">
            {workout.currentExercise + 1} / {workout.exercises.length}
          </p>
        </div>
      </div>

      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className={`h-full transition-all duration-300 ${
            workout.isResting
              ? 'bg-green-500 dark:bg-green-400'
              : 'bg-blue-500 dark:bg-blue-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={`flex-1 relative ${modeBorderStyle}`}>
        {workout.isResting ? (
          <>
            {nextExerciseHasMedia && (
              <div className="absolute inset-0 z-0">
                <MediaGallery 
                  media={nextExerciseData.media} 
                  theme="green"
                  isLandscape={true}
                  hideControls={!showOverlay}
                />
              </div>
            )}
            
            <div 
              className={`absolute inset-0 z-10 flex flex-col justify-center transition-opacity duration-500 ${overlayOpacityClass}`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-full pr-28 bg-gradient-to-r from-green-200/95 to-green-100/90 dark:from-green-900/95 dark:to-green-800/90 shadow-lg"></div>
              
              <div className="relative z-20 px-8 py-6 pr-28 @container">
                <h3 className="text-green-800 dark:text-green-200 font-bold mb-4 vertical-align-top
                  text-[51px] leading-[1.1]">
                  Next: {nextExerciseData?.title}
                </h3>
                <p className="text-green-700 dark:text-green-300 mb-6
                  text-[34px] leading-[1.2]">
                  {nextExerciseData?.instructions}
                </p>
                
                {nextExerciseData?.body_part_focus && (
                  <div className="flex items-center gap-4 mt-auto">
                    <BodyPartIcons 
                      bodyParts={nextExerciseData.body_part_focus} 
                      theme="green"
                      isLandscape={true}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
              {workout.isPaused ? (
                <button
                  onClick={resumeWorkout}
                  className={`h-14 w-14 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-transform ${buttonOpacity}`}
                  title="Resume"
                >
                  <Play className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={pauseWorkout}
                  className={`h-14 w-14 flex items-center justify-center bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 hover:scale-105 transition-transform ${buttonOpacity}`}
                  title="Pause"
                >
                  <Pause className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={handleSkip}
                className={`h-14 w-14 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform ${buttonOpacity}`}
                title="Skip to next"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              <button
                onClick={toggleOverlay}
                className={`h-14 w-14 flex items-center justify-center ${
                  showOverlay 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white rounded-full shadow-lg hover:scale-105 transition-transform ${buttonOpacity}`}
                title={showOverlay ? "Hide details" : "Show details"}
                disabled={!shouldAllowOverlayFade}
                style={{ opacity: shouldAllowOverlayFade ? 1 : 0.5, cursor: shouldAllowOverlayFade ? 'pointer' : 'not-allowed' }}
              >
                <Info className="w-6 h-6" />
              </button>
              <button
                onClick={shuffleNextExercise}
                disabled={!workout.isResting}
                className={`h-14 w-14 flex items-center justify-center ${
                  workout.isResting
                    ? 'bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-105'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                } rounded-full transition-transform ${buttonOpacity}`}
                title={workout.isResting ? "Shuffle next exercise" : "Can only shuffle during rest"}
              >
                <Shuffle className="w-6 h-6" />
              </button>
            </div>
          </>
        ) : (
          <>
            {currentExerciseHasMedia && (
              <div className="absolute inset-0 z-0">
                <MediaGallery 
                  media={currentExercise.media} 
                  theme="blue"
                  isLandscape={true}
                  hideControls={!showOverlay}
                />
              </div>
            )}
            
            <div 
              className={`absolute inset-0 z-10 flex flex-col justify-center transition-opacity duration-500 ${overlayOpacityClass}`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-full pr-28 bg-gradient-to-r from-blue-200/95 to-blue-100/90 dark:from-blue-900/95 dark:to-blue-800/90 shadow-lg"></div>
              
              <div className="relative z-20 px-8 py-6 pr-28 @container">
                <h1 className="text-blue-800 dark:text-blue-200 font-bold mb-4 vertical-align-top
                  text-[51px] leading-[1.1]">
                  {currentExercise.title}
                </h1>
                <p className="text-blue-700 dark:text-blue-300 mb-6
                  text-[34px] leading-[1.2]">
                  {currentExercise.instructions}
                </p>
                
                {currentExercise?.body_part_focus && (
                  <div className="mt-auto">
                    <BodyPartIcons 
                      bodyParts={currentExercise.body_part_focus} 
                      theme="blue"
                      isLandscape={true}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
              {workout.isPaused ? (
                <button
                  onClick={resumeWorkout}
                  className={`h-14 w-14 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-transform ${buttonOpacity}`}
                  title="Resume"
                >
                  <Play className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={pauseWorkout}
                  className={`h-14 w-14 flex items-center justify-center bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 hover:scale-105 transition-transform ${buttonOpacity}`}
                  title="Pause"
                >
                  <Pause className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={handleSkip}
                className={`h-14 w-14 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform ${buttonOpacity}`}
                title="Skip to next"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              <button
                onClick={toggleOverlay}
                className={`h-14 w-14 flex items-center justify-center ${
                  showOverlay 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white rounded-full shadow-lg hover:scale-105 transition-transform ${buttonOpacity}`}
                title={showOverlay ? "Hide details" : "Show details"}
                disabled={!shouldAllowOverlayFade}
                style={{ opacity: shouldAllowOverlayFade ? 1 : 0.5, cursor: shouldAllowOverlayFade ? 'pointer' : 'not-allowed' }}
              >
                <Info className="w-6 h-6" />
              </button>
              <button
                disabled={!workout.isResting}
                className={`h-14 w-14 flex items-center justify-center ${
                  workout.isResting
                    ? 'bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-105'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                } rounded-full transition-transform ${buttonOpacity}`}
                title="Can only shuffle during rest"
              >
                <Shuffle className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
