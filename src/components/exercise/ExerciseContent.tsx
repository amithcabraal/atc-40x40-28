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

  if (isLandscape) {
    return (
      <>
        {hasMedia && (
          <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
            <MediaGallery 
              media={exercise.media}
              theme={theme}
              isLandscape={true}
              hideControls={false}
              isPaused={isPaused}
            />
          </div>
        )}
        
        <div className="absolute inset-0 z-10 flex flex-col justify-center">
          <div className={`absolute left-0 top-0 bottom-0 w-full pr-28 bg-gradient-to-r ${
            theme === 'green'
              ? 'from-green-200/95 to-green-100/90 dark:from-green-900/95 dark:to-green-800/90'
              : 'from-blue-200/95 to-blue-100/90 dark:from-blue-900/95 dark:to-blue-800/90'
          } shadow-lg`}></div>
          
          <div className="relative z-20 px-8 py-6 pr-28 @container">
            <h1 className={`font-bold vertical-align-top text-[51px] leading-[1.1] ${
              theme === 'green'
                ? 'text-green-800 dark:text-green-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {exercise.title}
            </h1>
            <p className={`mb-6 text-[34px] leading-[1.2] ${
              theme === 'green'
                ? 'text-green-700 dark:text-green-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {exercise.instructions}
            </p>
            
            {exercise?.body_part_focus && (
              <div className="mt-auto">
                <BodyPartIcons 
                  bodyParts={exercise.body_part_focus} 
                  theme={theme}
                  isLandscape={true}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {hasMedia && (
        <div className="flex-1 relative">
          <MediaGallery 
            media={exercise.media}
            theme={theme}
            isLandscape={false}
            hideControls={false}
            isPaused={isPaused}
          />
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
