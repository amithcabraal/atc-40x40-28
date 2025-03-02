import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { Search, X, Video, VideoOff } from 'lucide-react';
import { MediaGallery } from './MediaGallery';
import { BodyPartIcons } from './BodyPartIcons';

interface Props {
  exercises: Exercise[];
  onClose: () => void;
}

export const ExerciseLibrary: React.FC<Props> = ({ exercises, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [showNoVideoOnly, setShowNoVideoOnly] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercises);
  
  // Extract unique categories and body parts
  const categories = Array.from(new Set(exercises.flatMap(ex => ex.categories)));
  const bodyParts = Array.from(new Set(exercises.flatMap(ex => ex.body_part_focus)));
  
  // Helper function to check if an exercise has a video
  const hasVideo = (exercise: Exercise): boolean => {
    return exercise.media?.some(media => media.type === 'video') || false;
  };
  
  // Filter exercises based on search term and selected filters
  useEffect(() => {
    let filtered = [...exercises];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.title.toLowerCase().includes(term) || 
        ex.instructions.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(ex => 
        ex.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
      );
    }
    
    // Apply body part filter
    if (selectedBodyPart) {
      filtered = filtered.filter(ex => 
        ex.body_part_focus.some(part => part.toLowerCase() === selectedBodyPart.toLowerCase())
      );
    }
    
    // Apply no video filter
    if (showNoVideoOnly) {
      filtered = filtered.filter(ex => !hasVideo(ex));
    }
    
    setFilteredExercises(filtered);
  }, [searchTerm, selectedCategory, selectedBodyPart, showNoVideoOnly, exercises]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedBodyPart(null);
    setShowNoVideoOnly(false);
  };
  
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Exercise Library</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* No Video filter */}
          <button
            onClick={() => setShowNoVideoOnly(!showNoVideoOnly)}
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              showNoVideoOnly
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {showNoVideoOnly ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            {showNoVideoOnly ? 'No Videos Only' : 'No Video Filter'}
          </button>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Body part filters */}
          <div className="flex flex-wrap gap-2">
            {bodyParts.map(part => (
              <button
                key={part}
                onClick={() => setSelectedBodyPart(selectedBodyPart === part ? null : part)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedBodyPart === part
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
          
          {/* Clear filters button */}
          {(searchTerm || selectedCategory || selectedBodyPart || showNoVideoOnly) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            >
              Clear filters
            </button>
          )}
        </div>
        
        {/* Filter stats */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredExercises.length} of {exercises.length} exercises
          {showNoVideoOnly && (
            <span className="ml-2">
              ({exercises.filter(ex => !hasVideo(ex)).length} without videos)
            </span>
          )}
        </div>
      </div>
      
      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-xl font-medium mb-2">No exercises found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                {/* Media gallery */}
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {exercise.media && exercise.media.length > 0 ? (
                    <MediaGallery media={exercise.media} autoplay={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No media available
                    </div>
                  )}
                  
                  {/* Video indicator */}
                  <div className="absolute top-2 right-2 z-10">
                    {hasVideo(exercise) ? (
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video
                      </span>
                    ) : (
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <VideoOff className="w-3 h-3" />
                        No Video
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Exercise details */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 dark:text-white">{exercise.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">{exercise.instructions}</p>
                  
                  {/* Tags */}
                  <div className="space-y-3">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                      {exercise.categories.map((category, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    {/* Body part focus */}
                    {exercise.body_part_focus && (
                      <BodyPartIcons bodyParts={exercise.body_part_focus} isLandscape={true} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
