import { create } from 'zustand';
import { Exercise, WorkoutStore } from '../types';

const initialWorkoutState = {
  currentExercise: 0,
  isResting: true, // Start with rest phase to show first exercise
  timeRemaining: 20, // Start with intro countdown
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
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workout: initialWorkoutState,
  startWorkout: (exercises: Exercise[], workoutType, duration) => {
    localStorage.removeItem('workoutState');
    
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
      isResting: true, // Always start with rest to show first exercise
      timeRemaining: 20,
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
  nextExercise: () => {
    const currentState = get().workout;
    const newState = {
      ...currentState,
      currentExercise: currentState.currentExercise + 1,
      isResting: true, // Always go to rest phase first
      timeRemaining: 20,
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  setTimeRemaining: (time: number) => {
    const newState = { ...get().workout, timeRemaining: time };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  toggleRest: () => {
    const newState = {
      ...get().workout,
      isResting: !get().workout.isResting,
      timeRemaining: get().workout.isResting ? 40 : 20,
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  shuffleNextExercise: () => {
    const { workout } = get();
    const currentExercises = [...workout.exercises];
    const nextExerciseIndex = workout.currentExercise + 1;
    
    const availableExercises = currentExercises.filter((_, index) => 
      index !== workout.currentExercise
    );
    
    const currentExerciseSet = new Set(currentExercises.map(ex => ex.title));
    
    let newExercise = null;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!newExercise && attempts < maxAttempts) {
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      const candidateExercise = availableExercises[randomIndex];
      
      if (!currentExerciseSet.has(candidateExercise.title) || attempts > 5) {
        newExercise = candidateExercise;
      }
      
      attempts++;
    }
    
    if (!newExercise) {
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      newExercise = availableExercises[randomIndex];
    }
    
    currentExercises[nextExerciseIndex] = newExercise;
    
    const newState = {
      ...workout,
      exercises: currentExercises
    };
    
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
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
