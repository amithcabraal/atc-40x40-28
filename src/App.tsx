import React, { useState, useEffect } from 'react';
import { Exercise, Session, Theme } from './types';
import { useWorkoutStore } from './store/workoutStore';
import { ExerciseDisplay } from './components/ExerciseDisplay';
import { WorkoutHistory } from './components/WorkoutHistory';
import { Calendar, HelpCircle, List, Menu, Settings, Share2, Sun, Moon, Laptop, BookOpen, History, X } from 'lucide-react';
import { Volume2, VolumeX } from 'lucide-react';
import exerciseData from './data/updated_100_exercises_with_intensity.json';
import { ResumeWorkoutModal } from './components/ResumeWorkoutModal';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { WorkoutSelection } from './components/WorkoutSelection';
import { useAudioStore } from './store/audioStore';
import { LocationSettings } from './components/settings/LocationSettings';

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [theme, setTheme] = useState<Theme>('system');
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showWorkoutSelection, setShowWorkoutSelection] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'appearance' | 'sound' | 'locations'>('appearance');
  const { workout, startWorkout, resumeSavedWorkout } = useWorkoutStore();
  const { isMuted, toggleMute } = useAudioStore();

  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (welcomeShown) {
      setShowWelcome(false);
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }

    const savedSessions = localStorage.getItem('workout-sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    // Check if there's a saved workout
    const savedWorkout = localStorage.getItem('workoutState');
    if (savedWorkout) {
      try {
        const parsedWorkout = JSON.parse(savedWorkout);
        if (parsedWorkout.isActive && parsedWorkout.exercises.length > 0) {
          setShowResumeModal(true);
        }
      } catch (error) {
        console.error('Error parsing saved workout:', error);
      }
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDark);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const saveSession = (exercises: Exercise[], rating?: number, notes?: string) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      exercises,
      rating,
      notes
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('workout-sessions', JSON.stringify(updatedSessions));
  };

  const startNewWorkout = () => {
    setShowResumeModal(false);
    setShowWorkoutSelection(true);
  };

  const handleStartWorkoutWithSelection = (selectedExercises: Exercise[], workoutType: 'cardio' | 'strength' | 'yoga' | 'mix', duration: number, location?: Location) => {
    setShowWorkoutSelection(false);
    startWorkout(selectedExercises, workoutType, duration, location);
  };

  const handleResumeWorkout = () => {
    setShowResumeModal(false);
    resumeSavedWorkout();
  };

  const dismissWelcome = () => {
    localStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  const shareApp = async () => {
    try {
      await navigator.share({
        title: 'MyFitnessTimer',
        text: 'Check out this awesome workout app!',
        url: window.location.href
      });
    } catch (error) {
      console.log('Sharing failed', error);
    }
    setShowMenu(false);
  };

  if (workout.isActive) {
    return <ExerciseDisplay onComplete={saveSession} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MyFitnessTimer</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setShowSettings(true);
                setShowMenu(false);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-6 h-6 dark:text-white" />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6 dark:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md m-4">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Welcome to MyFitnessTimer!</h2>
            <p className="mb-6 dark:text-gray-300">
              Get ready for an amazing workout experience. This app will help you:
            </p>
            <ul className="list-disc pl-5 mb-6 dark:text-gray-300">
              <li>Complete 40-second exercises with 20-second rests</li>
              <li>Track your progress</li>
              <li>Save and repeat your favorite workouts</li>
            </ul>
            <button
              onClick={dismissWelcome}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Resume Workout Modal */}
      {showResumeModal && (
        <ResumeWorkoutModal 
          onResume={handleResumeWorkout}
          onStartNew={startNewWorkout}
          onClose={() => setShowResumeModal(false)}
        />
      )}

      {/* Workout Selection Screen */}
      {showWorkoutSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <WorkoutSelection 
            onStartWorkout={handleStartWorkoutWithSelection}
            exercises={exerciseData.exercises}
            onClose={() => setShowWorkoutSelection(false)}
          />
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>

            {/* Settings Tabs */}
            <div className="flex space-x-4 mb-6 border-b dark:border-gray-700">
              <button
                onClick={() => setActiveSettingsTab('appearance')}
                className={`pb-2 px-4 ${
                  activeSettingsTab === 'appearance'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Appearance
              </button>
              <button
                onClick={() => setActiveSettingsTab('sound')}
                className={`pb-2 px-4 ${
                  activeSettingsTab === 'sound'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Sound
              </button>
              <button
                onClick={() => setActiveSettingsTab('locations')}
                className={`pb-2 px-4 ${
                  activeSettingsTab === 'locations'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Locations
              </button>
            </div>

            {/* Settings Content */}
            <div className="space-y-6">
              {activeSettingsTab === 'appearance' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Theme</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => changeTheme('light')}
                      className={`w-full flex items-center justify-between p-3 rounded ${
                        theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center">
                        <Sun className="w-5 h-5 mr-2" />
                        Light
                      </span>
                    </button>
                    <button
                      onClick={() => changeTheme('dark')}
                      className={`w-full flex items-center justify-between p-3 rounded ${
                        theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center">
                        <Moon className="w-5 h-5 mr-2" />
                        Dark
                      </span>
                    </button>
                    <button
                      onClick={() => changeTheme('system')}
                      className={`w-full flex items-center justify-between p-3 rounded ${
                        theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <span className="flex items-center">
                        <Laptop className="w-5 h-5 mr-2" />
                        System
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'sound' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Sound</h3>
                  <button
                    onClick={toggleMute}
                    className={`w-full flex items-center justify-between p-3 rounded ${
                      isMuted ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-500 text-white'
                    }`}
                  >
                    <span className="flex items-center">
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 mr-2" />
                      ) : (
                        <Volume2 className="w-5 h-5 mr-2" />
                      )}
                      {isMuted ? 'Sound Off' : 'Sound On'}
                    </span>
                  </button>
                </div>
              )}

              {activeSettingsTab === 'locations' && (
                <LocationSettings />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Library */}
      {showExerciseLibrary && (
        <ExerciseLibrary 
          exercises={exerciseData.exercises} 
          onClose={() => {
            setShowExerciseLibrary(false);
            setShowMenu(false);
          }} 
        />
      )}

      {/* Workout History */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Workout History</h2>
              <button
                onClick={() => {
                  setShowHistory(false);
                  setShowMenu(false);
                }}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6 dark:text-white" />
              </button>
            </div>
            <WorkoutHistory
              sessions={sessions}
              onRepeat={(session) => {
                startWorkout(
                  session.exercises, 
                  session.stats?.workoutType || 'mix', 
                  session.stats?.selectedDuration || 30,
                  session.stats?.location
                );
                setShowHistory(false);
                setShowMenu(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={startNewWorkout}
            className="w-full max-w-lg bg-blue-500 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors mb-8"
          >
            Start New Workout
          </button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {exerciseData.exercises.length} exercises available
          </div>
        </div>
      </main>

      {/* Menu */}
      {showMenu && (
        <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 z-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white">Menu</h2>
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-6 h-6 dark:text-white" />
            </button>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => {
                setShowHistory(true);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <History className="w-5 h-5" />
              <span>Workout History</span>
            </button>
            <button 
              onClick={() => {
                setShowExerciseLibrary(true);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <BookOpen className="w-5 h-5" />
              <span>Exercise Library</span>
            </button>
            <button 
              onClick={() => {
                window.open('/help', '_blank');
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </button>
            <button 
              onClick={() => {
                shareApp();
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button 
              onClick={() => {
                window.open('/privacy', '_blank');
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <List className="w-5 h-5" />
              <span>Privacy Policy</span>
            </button>
            <button 
              onClick={() => {
                setShowSettings(true);
                setShowMenu(false);
              }}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
