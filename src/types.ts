export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Exercise {
  id?: number;
  title: string;
  instructions: string;
  categories: string[];
  body_part_focus: string[];
  media?: Media[];
}

export interface WorkoutStats {
  totalDuration: number;
  skippedExercises: number;
  totalExerciseTime: number;
  workoutType: 'cardio' | 'strength' | 'yoga' | 'mix';
  selectedDuration: number;
}

export interface Session {
  id: string;
  created_at: string;
  exercises: Exercise[];
  rating?: number;
  notes?: string;
  stats?: WorkoutStats;
}

export interface WorkoutState {
  currentExercise: number;
  isResting: boolean;
  timeRemaining: number;
  exercises: Exercise[];
  isActive: boolean;
  isPaused: boolean;
  isIntro?: boolean;
  isResuming?: boolean;
  startTime?: number;
  skippedExercises: number;
  totalExerciseTime: number;
  workoutType: 'cardio' | 'strength' | 'yoga' | 'mix';
  selectedDuration: number;
}

export interface WorkoutStore {
  workout: WorkoutState;
  startWorkout: (exercises: Exercise[], workoutType: 'cardio' | 'strength' | 'yoga' | 'mix', duration: number) => void;
  resumeSavedWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
  nextExercise: () => void;
  setTimeRemaining: (time: number) => void;
  toggleRest: () => void;
  shuffleNextExercise: () => void;
  completeIntro: () => void;
  incrementSkippedExercises: () => void;
  updateExerciseTime: (time: number) => void;
}

export type Theme = 'light' | 'dark' | 'system';
