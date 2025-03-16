import { create } from 'zustand';
import { Exercise, WorkoutStore, Location } from '../types';

const initialWorkoutState = {
  currentExercise: 0,
  isResting: true,
  timeRemaining: 20,
  exercises: [],
  isActive: false,
  isPaused: false,
  isIntro: true,
  isResuming: false,
  startTime: Date.now(),
  skippedExercises: 0,
  totalExerciseTime: 0,
  workoutType: 'mix' as const,
  selectedDuration: 30,
  isTransitioning: false,
  isSevenMinute: false,
  location: undefined
};

const handleTransition = (callback: () => void) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      callback();
      setTimeout(resolve, 600);
    }, 600);
  });
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workout: initialWorkoutState,
  startWorkout: (exercises: Exercise[], workoutType, duration, location) => {
    localStorage.removeItem('workoutState');
    
    const isSevenMinute = duration === 7;
    
    const workoutState = { 
      ...initialWorkoutState, 
      exercises, 
      isActive: true,
      timeRemaining: 20,
      isIntro: true,
      isResuming: false,
      startTime: Date.now(),
      workoutType,
      selectedDuration: duration,
      isSevenMinute,
      location
    };
    set({ workout: workoutState });
    localStorage.setItem('workoutState', JSON.stringify(workoutState));
  },
  resumeSavedWorkout: () => {
    try {
      const savedState = localStorage.getItem('workoutState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.isActive) {
          const resumeState = {
            ...parsedState,
            isIntro: true,
            timeRemaining: 20,
            isPaused: false,
            isResuming: true,
            isTransitioning: false,
          };
          set({ workout: resumeState });
          localStorage.setItem('workoutState', JSON.stringify(resumeState));
        }
      }
    } catch (error) {
      console.error('Error resuming workout:', error);
    }
  },
  completeIntro: () => {
    const currentState = get().workout;
    const newState = {
      ...currentState,
      isIntro: false,
      isResuming: false,
      isResting: true,
      timeRemaining: currentState.isSevenMinute ? 10 : 20,
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  pauseWorkout: () => {
    const newState = { ...get().workout, isPaused: true };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  resumeWorkout: () => {
    const newState = { ...get().workout, isPaused: false };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  stopWorkout: () => {
    set({ workout: initialWorkoutState });
    localStorage.removeItem('workoutState');
  },
  nextExercise: async () => {
    const currentState = get().workout;
    
    // Start transition
    set({ workout: { ...currentState, isTransitioning: true }});
    
    await handleTransition(() => {
      const currentState = get().workout;
      // Check if this is the last exercise
      if (currentState.currentExercise >= currentState.exercises.length - 1) {
        // If we're in exercise mode of the last exercise, deactivate the workout
        if (!currentState.isResting) {
          const newState = {
            ...currentState,
            isActive: false,
            isTransitioning: false,
          };
          set({ workout: newState });
          localStorage.setItem('workoutState', JSON.stringify(newState));
        } else {
          // If we're in rest mode of the last exercise, go to exercise mode
          const newState = {
            ...currentState,
            isResting: false,
            timeRemaining: currentState.isSevenMinute ? 30 : 40,
            isTransitioning: false,
          };
          set({ workout: newState });
          localStorage.setItem('workoutState', JSON.stringify(newState));
        }
      } else {
        // Not the last exercise, proceed normally
        const newState = {
          ...currentState,
          currentExercise: currentState.currentExercise + 1,
          isResting: true,
          timeRemaining: currentState.isSevenMinute ? 10 : 20,
          isTransitioning: false,
        };
        set({ workout: newState });
        localStorage.setItem('workoutState', JSON.stringify(newState));
      }
    });
  },
  setTimeRemaining: (time: number) => {
    const newState = { ...get().workout, timeRemaining: time };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  toggleRest: async () => {
    const currentState = get().workout;
    
    // Start transition
    set({ workout: { ...currentState, isTransitioning: true }});
    
    await handleTransition(() => {
      const currentState = get().workout;
      const newState = {
        ...currentState,
        isResting: !currentState.isResting,
        timeRemaining: currentState.isSevenMinute 
          ? (currentState.isResting ? 30 : 10)
          : (currentState.isResting ? 40 : 20),
        isTransitioning: false,
      };
      set({ workout: newState });
      localStorage.setItem('workoutState', JSON.stringify(newState));
    });
  },
  shuffleNextExercise: async () => {
    const currentState = get().workout;
    
    // Only allow shuffling during rest mode
    if (!currentState.isResting) {
      return;
    }

    // Start transition
    set({ workout: { ...currentState, isTransitioning: true }});
    
    await handleTransition(() => {
      const currentState = get().workout;
      const currentExercises = [...currentState.exercises];
      const currentIndex = currentState.currentExercise;
      
      // Create a pool of exercises to choose from (excluding current exercise)
      const exercisePool = currentExercises.filter((_, index) => 
        index !== currentIndex
      );

      if (exercisePool.length === 0) {
        return; // No exercises available to shuffle with
      }

      // Pick a random exercise from the pool
      const randomIndex = Math.floor(Math.random() * exercisePool.length);
      const newExercise = exercisePool[randomIndex];

      // Replace the current exercise with the randomly selected one
      currentExercises[currentIndex] = newExercise;

      const newState = {
        ...currentState,
        exercises: currentExercises,
        timeRemaining: currentState.isSevenMinute ? 10 : 20,
        isTransitioning: false,
      };
      
      set({ workout: newState });
      localStorage.setItem('workoutState', JSON.stringify(newState));
    });
  },
  incrementSkippedExercises: () => {
    const newState = {
      ...get().workout,
      skippedExercises: get().workout.skippedExercises + 1
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  updateExerciseTime: (time: number) => {
    const newState = {
      ...get().workout,
      totalExerciseTime: get().workout.totalExerciseTime + time
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  }
}));
