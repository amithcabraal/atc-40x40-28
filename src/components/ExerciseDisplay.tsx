import React, { useState, useEffect } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { Timer } from './Timer';
import { Play, Pause, Square, Star, SkipForward, Shuffle } from 'lucide-react';
import { Exercise } from '../types';
import { MediaGallery } from './MediaGallery';
import { IntroView } from './IntroView';
import { BodyPartIcons } from './BodyPartIcons';

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
    completeIntro 
  } = useWorkoutStore();
  
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showRating, setShowRating] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  
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

  const handleComplete = () => {
    onComplete(workout.exercises, rating, notes);
    stopWorkout();
    localStorage.removeItem('workoutState');
  };

  const handleSkip = () => {
    if (workout.currentExercise >= workout.exercises.length - 1) {
      setShowRating(true);
    } else {
      if (workout.isResting) {
        nextExercise();
      } else {
        toggleRest();
      }
    }
  };

  const handleStop = () => {
    setShowRating(true);
  };

  if (workout.isIntro) {
    return <IntroView onComplete={completeIntro} isResuming={workout.isResuming} />;
  }

  if (showRating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Rate Your Workout</h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`p-2 ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your workout (optional)"
            className="w-full p-4 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            rows={4}
          />
          <button
            onClick={handleComplete}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Workout
          </button>
        </div>
      </div>
    );
  }

  if (!workout.isActive) return null;

  // Portrait mode layout
  if (!isLandscape) {
    return (
      <div className={`flex flex-col h-screen ${
        workout.isResting 
          ? 'bg-green-50 dark:bg-green-950 bg-gradient-to-b from-green-100 to-green-50 dark:from-green-900 dark:to-green-950' 
          : 'bg-blue-50 dark:bg-blue-950 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950'
      } transition-colors duration-300`}>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-4 py-2 flex justify-between items-center">
          <div className={`px-3 py-1 rounded-md font-medium ${
            workout.isResting
              ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
              : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
          }`}>
            {workout.isResting ? 'REST' : 'EXERCISE'}
          </div>
          <p className={`text-lg font-medium ${
            workout.isResting
              ? 'text-green-600 dark:text-green-400'
              : 'text-blue-600 dark:text-blue-400'
          }`}>
            {workout.currentExercise + 1} / {workout.exercises.length}
          </p>
        </div>

        <Timer onComplete={handleSkip} />

        <div className="flex-1 flex flex-col px-4 py-2 overflow-hidden">
          {workout.isResting ? (
            <div className="space-y-2 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 bg-green-100/50 dark:bg-green-900/50 h-full flex flex-col">
              <h3 className="text-responsive font-bold text-green-800 dark:text-green-200 text-balance">
                Next: {nextExerciseData?.title}
              </h3>
              
              <p className="text-lg text-green-700 dark:text-green-300 flex-shrink-0">
                {nextExerciseData?.instructions}
              </p>
              
              {nextExerciseData?.media && (
                <div className="flex-grow">
                  <MediaGallery 
                    media={nextExerciseData.media} 
                    theme="green"
                  />
                </div>
              )}
              
              {nextExerciseData?.body_part_focus && (
                <div className="flex justify-between items-center flex-shrink-0 mt-2">
                  <BodyPartIcons 
                    bodyParts={nextExerciseData.body_part_focus} 
                    theme="green"
                  />
                  <button
                    onClick={shuffleNextExercise}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-transform hover:scale-105 flex-shrink-0"
                    title="Shuffle next exercise"
                  >
                    <Shuffle size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 bg-blue-100/50 dark:bg-blue-900/50 h-full flex flex-col">
              <h1 className="text-responsive font-bold text-blue-800 dark:text-blue-200 text-balance">
                {currentExercise.title}
              </h1>
              
              <p className="text-xl text-blue-700 dark:text-blue-300 flex-shrink-0">
                {currentExercise.instructions}
              </p>
              
              {currentExercise?.media && (
                <div className="flex-grow">
                  <MediaGallery 
                    media={currentExercise.media}
                    theme="blue"
                  />
                </div>
              )}
              
              {currentExercise?.body_part_focus && (
                <div className="flex-shrink-0 mt-2">
                  <BodyPartIcons 
                    bodyParts={currentExercise.body_part_focus} 
                    theme="blue"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`w-full ${
          workout.isResting
            ? 'bg-green-100 dark:bg-green-900'
            : 'bg-blue-100 dark:bg-blue-900'
        } p-4 transition-colors duration-300`}>
          <div className="flex justify-center space-x-6">
            {workout.isPaused ? (
              <button
                onClick={resumeWorkout}
                className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-transform hover:scale-105"
              >
                <Play size={24} />
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-transform hover:scale-105"
              >
                <Pause size={24} />
              </button>
            )}
            <button
              onClick={handleSkip}
              className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform hover:scale-105"
              title="Skip to next"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={handleStop}
              className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-105"
            >
              <Square size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Landscape mode layout with vertical controls on the right
  return (
    <div className={`flex flex-col h-screen ${
      workout.isResting 
        ? 'bg-green-50 dark:bg-green-950 bg-gradient-to-b from-green-100 to-green-50 dark:from-green-900 dark:to-green-950' 
        : 'bg-blue-50 dark:bg-blue-950 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950'
    } transition-colors duration-300`}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header with mode and timer */}
      <div className="grid grid-cols-3 items-center px-2 py-1">
        <div className={`px-3 py-1 rounded-md font-medium text-sm ${
          workout.isResting
            ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
            : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
        }`}>
          {workout.isResting ? 'REST' : 'EXERCISE'}
        </div>
        
        <div className="flex justify-center">
          <Timer onComplete={handleSkip} isLandscape={true} />
        </div>
        
        <div className="flex justify-end">
          <p className={`text-sm font-medium ${
            workout.isResting
              ? 'text-green-600 dark:text-green-400'
              : 'text-blue-600 dark:text-blue-400'
          }`}>
            {workout.currentExercise + 1} / {workout.exercises.length}
          </p>
        </div>
      </div>

      {/* Main content area with vertical controls on the right */}
      <div className="flex-1 relative">
        {/* Video background */}
        {workout.isResting ? (
          <>
            {nextExerciseData?.media && nextExerciseData.media.length > 0 && (
              <div className="absolute inset-0 z-0">
                <MediaGallery 
                  media={nextExerciseData.media} 
                  theme="green"
                  isLandscape={true}
                />
              </div>
            )}
            
            {/* Overlay with exercise info */}
            <div className="absolute top-0 left-0 z-10 max-w-[33%] p-3 bg-green-100/80 dark:bg-green-900/80 rounded-br-lg">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200 line-clamp-2">
                Next: {nextExerciseData?.title}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 line-clamp-3">
                {nextExerciseData?.instructions}
              </p>
            </div>
            
            {/* Target areas and shuffle button */}
            {nextExerciseData?.body_part_focus && (
              <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2">
                <BodyPartIcons 
                  bodyParts={nextExerciseData.body_part_focus} 
                  theme="green"
                  isLandscape={true}
                />
                <button
                  onClick={shuffleNextExercise}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-transform hover:scale-105"
                  title="Shuffle next exercise"
                >
                  <Shuffle size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {currentExercise?.media && currentExercise.media.length > 0 && (
              <div className="absolute inset-0 z-0">
                <MediaGallery 
                  media={currentExercise.media} 
                  theme="blue"
                  isLandscape={true}
                />
              </div>
            )}
            
            {/* Overlay with exercise info */}
            <div className="absolute top-0 left-0 z-10 max-w-[33%] p-3 bg-blue-100/80 dark:bg-blue-900/80 rounded-br-lg">
              <h1 className="text-xl font-bold text-blue-800 dark:text-blue-200 line-clamp-2">
                {currentExercise.title}
              </h1>
              <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-3">
                {currentExercise.instructions}
              </p>
            </div>
            
            {/* Target areas */}
            {currentExercise?.body_part_focus && (
              <div className="absolute bottom-2 left-2 z-10">
                <BodyPartIcons 
                  bodyParts={currentExercise.body_part_focus} 
                  theme="blue"
                  isLandscape={true}
                />
              </div>
            )}
          </>
        )}

        {/* Vertical control buttons on the right edge */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
          {workout.isPaused ? (
            <button
              onClick={resumeWorkout}
              className={`p-3 rounded-full shadow-lg hover:scale-105 transition-transform ${
                workout.isResting
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
              title="Resume"
            >
              <Play size={20} />
            </button>
          ) : (
            <button
              onClick={pauseWorkout}
              className="p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 hover:scale-105 transition-transform"
              title="Pause"
            >
              <Pause size={20} />
            </button>
          )}
          <button
            onClick={handleSkip}
            className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform"
            title="Skip to next"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={handleStop}
            className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-transform"
            title="Stop workout"
          >
            <Square size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
