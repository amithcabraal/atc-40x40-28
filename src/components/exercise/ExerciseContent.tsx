import React from 'react';
import { Exercise } from '../../types';
import { MediaGallery } from '../MediaGallery';
import { BodyPartIcons } from '../BodyPartIcons';

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
  showOverlay,
  overlayOpacityClass,
  theme,
  isLandscape,
  isPaused
}) => {
  const hasMedia = exercise?.media && exercise.media.length > 0;

  return (
    <>
      {hasMedia && (
        <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
          <MediaGallery 
            media={exercise.media}
            theme={theme}
            isLandscape={isLandscape}
            hideControls={!showOverlay}
            isPaused={isPaused}
          />
        </div>
      )}
      
      <div 
        className={`absolute inset-0 z-10 p-4 ${
          isLandscape 
            ? 'flex flex-col justify-center'
            : ''
        } transition-opacity duration-500 ${overlayOpacityClass}`}
      >
        {isLandscape ? (
          <>
            <div className={`absolute left-0 top-0 bottom-0 w-full pr-28 bg-gradient-to-r ${
              theme === 'green'
                ? 'from-green-200/95 to-green-100/90 dark:from-green-900/95 dark:to-green-800/90'
                : 'from-blue-200/95 to-blue-100/90 dark:from-blue-900/95 dark:to-blue-800/90'
            } shadow-lg`}></div>
            
            <div className="relative z-20 px-8 py-6 pr-28 @container">
              <h1 className={`font-bold mb-4 vertical-align-top text-[51px] leading-[1.1] ${
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
          </>
        ) : (
          <div className={`bg-gradient-to-b ${
            theme === 'green'
              ? 'from-green-200/90 to-green-100/80 dark:from-green-900/90 dark:to-green-800/80'
              : 'from-blue-200/90 to-blue-100/80 dark:from-blue-900/90 dark:to-blue-800/80'
          } rounded-lg h-full flex flex-col p-4`}>
            <div className="@container">
              <h1 className={`font-bold mb-4 vertical-align-top text-[51px] leading-[1.1] ${
                theme === 'green'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {exercise.title}
              </h1>
              <p className={`flex-shrink-0 mb-4 text-[34px] leading-[1.2] ${
                theme === 'green'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {exercise.instructions}
              </p>
            </div>
            
            {exercise?.body_part_focus && (
              <div className="mt-auto flex-shrink-0">
                <BodyPartIcons 
                  bodyParts={exercise.body_part_focus} 
                  theme={theme}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};