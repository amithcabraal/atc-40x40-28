import React from 'react';
import { Exercise } from '../../types';
import { MediaGallery } from '../MediaGallery';
import { BodyPartIcons } from '../BodyPartIcons';
import { ExerciseCarousel } from './ExerciseCarousel';

interface ExerciseContentProps {
  exercise: Exercise;
  showOverlay: boolean;
  overlayOpacityClass: string;
  theme: 'blue' | 'green';
  isLandscape?: boolean;
  isPaused?: boolean;
}

export const ExerciseContent: React.FC<ExerciseContentProps> = ({
  exercise,
  theme,
  isLandscape,
  isPaused
}) => {
  const hasMedia = exercise?.media && exercise.media.length > 0;

  const RestOverlay = () => (
    <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none">
      <div className="absolute top-4 left-4">
        <span className="text-[32px] font-bold text-white">REST</span>
      </div>
    </div>
  );

  if (isLandscape) {
    return (
      <div className="flex h-full">
        {/* Left side: Clock and Carousel */}
        <div className="w-1/3 flex flex-col h-full">
          <div className="h-[40%] flex items-center justify-center">
            {/* Clock will be rendered here by parent component */}
          </div>
          <div className="h-[60%]">
            <ExerciseCarousel 
              exercise={exercise}
              theme={theme}
              autoRotate={!isPaused}
            />
          </div>
        </div>

        {/* Right side: Video */}
        <div className="w-2/3 relative">
          {hasMedia ? (
            <div className="absolute inset-0">
              <MediaGallery 
                media={exercise.media}
                theme={theme}
                isLandscape={true}
                hideControls={false}
                isPaused={isPaused}
              />
              {theme === 'green' && <RestOverlay />}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <p className="text-gray-400">No media available</p>
              {theme === 'green' && <RestOverlay />}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {hasMedia && (
        <div className="relative" data="amith">
          <MediaGallery 
            media={exercise.media}
            theme={theme}
            isLandscape={false}
            hideControls={false}
            isPaused={isPaused}
          />
          {theme === 'green' && <RestOverlay />}
        </div>
      )}
      
      <div className="h-40 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <ExerciseCarousel 
          exercise={exercise}
          theme={theme}
          autoRotate={!isPaused}
        />
      </div>
    </div>
  );
};
