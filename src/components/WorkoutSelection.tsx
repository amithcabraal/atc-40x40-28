import React, { useState } from 'react';
import { Exercise } from '../types';
import { Dumbbell, Zap, Cog as Yoga, Shuffle, Clock, X } from 'lucide-react';

interface WorkoutSelectionProps {
  onStartWorkout: (exercises: Exercise[], workoutType: 'cardio' | 'strength' | 'yoga' | 'mix', duration: number) => void;
  exercises: Exercise[];
  onClose: () => void;
}

export const WorkoutSelection: React.FC<WorkoutSelectionProps> = ({ onStartWorkout, exercises, onClose }) => {
  const [selectedType, setSelectedType] = useState<'cardio' | 'strength' | 'yoga' | 'mix' | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  
  const handleStartWorkout = () => {
    if (!selectedType) return;
    
    const exercisesNeeded = selectedDuration;
    let filteredExercises: Exercise[] = [];
    
    if (selectedType === 'cardio') {
      filteredExercises = exercises.filter(ex => 
        ex.categories.some(cat => 
          cat.toLowerCase() === 'cardio' || 
          cat.toLowerCase() === 'aerobic'
        )
      );
    } else if (selectedType === 'strength') {
      filteredExercises = exercises.filter(ex => 
        ex.categories.some(cat => 
          cat.toLowerCase() === 'strength'
        )
      );
    } else if (selectedType === 'yoga') {
      filteredExercises = exercises.filter(ex => 
        ex.categories.some(cat => 
          cat.toLowerCase() === 'yoga' || 
          cat.toLowerCase() === 'flexibility' ||
          cat.toLowerCase() === 'mobility'
        )
      );
    } else {
      filteredExercises = [...exercises];
    }
    
    let shuffled = [...filteredExercises].sort(() => Math.random() - 0.5);
    
    if (shuffled.length < exercisesNeeded) {
      const remainingNeeded = exercisesNeeded - shuffled.length;
      const otherExercises = exercises.filter(ex => !shuffled.includes(ex))
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingNeeded);
      
      shuffled = [...shuffled, ...otherExercises];
    }
    
    const selectedExercises = shuffled.slice(0, exercisesNeeded);
    onStartWorkout(selectedExercises, selectedType, selectedDuration);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto relative flex flex-col md:flex-row gap-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Left Column - Workout Types */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Choose Your Workout</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedType('cardio')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              selectedType === 'cardio'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <Zap className={`w-8 h-8 mb-2 ${
              selectedType === 'cardio' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span className={`font-medium ${
              selectedType === 'cardio' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
            }`}>Cardio</span>
          </button>
          
          <button
            onClick={() => setSelectedType('strength')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              selectedType === 'strength'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
            }`}
          >
            <Dumbbell className={`w-8 h-8 mb-2 ${
              selectedType === 'strength' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span className={`font-medium ${
              selectedType === 'strength' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
            }`}>Strength</span>
          </button>
          
          <button
            onClick={() => setSelectedType('yoga')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              selectedType === 'yoga'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
            }`}
          >
            <Yoga className={`w-8 h-8 mb-2 ${
              selectedType === 'yoga' ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span className={`font-medium ${
              selectedType === 'yoga' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
            }`}>Yoga</span>
          </button>
          
          <button
            onClick={() => setSelectedType('mix')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              selectedType === 'mix'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
            }`}
          >
            <Shuffle className={`w-8 h-8 mb-2 ${
              selectedType === 'mix' ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span className={`font-medium ${
              selectedType === 'mix' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
            }`}>Mix</span>
          </button>
        </div>
      </div>

      {/* Right Column - Duration and Start Button */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Clock className="w-5 h-5 mr-2" />
            Duration (minutes)
          </h3>
          <div className="flex justify-between gap-4">
            {[20, 30, 40].map(duration => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  selectedDuration === duration
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartWorkout}
          disabled={!selectedType}
          className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all mt-6 ${
            selectedType
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
          }`}
        >
          {selectedType ? 'Start Workout' : 'Select a workout type'}
        </button>
      </div>
    </div>
  );
};