export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Equipment {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
  equipment: Equipment[];
}

export interface Exercise {
  id?: number;
  title: string;
  instructions: string;
  categories: string[];
  body_part_focus: string[];
  media?: Media[];
  requiredEquipment?: string[]; // Equipment names required for this exercise
}

export interface WorkoutStats {
  totalDuration: number;
  skippedExercises: number;
  totalExerciseTime: number;
  workoutType: 'cardio' | 'strength' | 'yoga' | 'mix';
  selectedDuration: number;
  location?: Location;
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
  isTransitioning: boolean;
  isSevenMinute: boolean;
  location?: Location;
}

export interface WorkoutStore {
  workout: WorkoutState;
  startWorkout: (exercises: Exercise[], workoutType: 'cardio' | 'strength' | 'yoga' | 'mix', duration: number, location?: Location) => void;
  resumeSavedWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
  nextExercise: () => Promise<void>;
  setTimeRemaining: (time: number) => void;
  toggleRest: () => Promise<void>;
  shuffleNextExercise: () => Promise<void>;
  completeIntro: () => void;
  incrementSkippedExercises: () => void;
  updateExerciseTime: (time: number) => void;
}

export type Theme = 'light' | 'dark' | 'system';
