import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Exercise } from '../../types';
import { BodyPartIcons } from '../BodyPartIcons';

interface ExerciseCarouselProps {
  exercise: Exercise;
  theme: 'blue' | 'green';
  autoRotate?: boolean;
}

const SLIDE_HEIGHT = 160;
const MAX_INSTRUCTION_LENGTH = 45; // Length of "Step backward into lunge position, alternating legs"

export const ExerciseCarousel: React.FC<ExerciseCarouselProps> = ({
  exercise,
  theme,
  autoRotate = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousExerciseRef = useRef<string>(exercise.title);

  // Split instructions if needed
  const instructionSlides = useMemo(() => {
    if (exercise.instructions.length <= MAX_INSTRUCTION_LENGTH) {
      return [exercise.instructions];
    }

    // Find the last space before MAX_INSTRUCTION_LENGTH
    let splitIndex = MAX_INSTRUCTION_LENGTH;
    while (splitIndex > 0 && exercise.instructions[splitIndex] !== ' ') {
      splitIndex--;
    }
    
    // If no space found, use MAX_INSTRUCTION_LENGTH
    if (splitIndex === 0) {
      splitIndex = MAX_INSTRUCTION_LENGTH;
    }

    const firstPart = exercise.instructions.substring(0, splitIndex) + '...';
    const secondPart = exercise.instructions.substring(splitIndex).trim();
    return [firstPart, secondPart];
  }, [exercise.instructions]);

  // Reset to first slide when exercise changes
  useEffect(() => {
    if (previousExerciseRef.current !== exercise.title) {
      setCurrentSlide(0);
      previousExerciseRef.current = exercise.title;
    }
  }, [exercise.title]);

  // Create all slides
  const slides = useMemo(() => {
    const allSlides = [
      {
        id: 'title',
        content: (
          <h2 className={`font-bold text-[51px] leading-[1.1] ${
            theme === 'green'
              ? 'text-green-800 dark:text-green-200'
              : 'text-blue-800 dark:text-blue-200'
          }`}>
            {exercise.title}
          </h2>
        )
      },
      ...instructionSlides.map((text, index) => ({
        id: `instructions-${index}`,
        content: (
          <p className={`text-[34px] leading-[1.2] ${
            theme === 'green'
              ? 'text-green-700 dark:text-green-300'
              : 'text-blue-700 dark:text-blue-300'
          }`}>
            {text}
          </p>
        )
      })),
      {
        id: 'bodyParts',
        content: (
          <div className="flex flex-col">
            <span className={`text-[34px] leading-[1.2] mb-2 ${
              theme === 'green'
                ? 'text-green-700 dark:text-green-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              Target Areas:
            </span>
            <BodyPartIcons 
              bodyParts={exercise.body_part_focus} 
              theme={theme}
              isLandscape={false}
            />
          </div>
        )
      }
    ];

    return allSlides;
  }, [exercise, theme, instructionSlides]);

  const startAutoRotate = () => {
    if (autoRotate && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
  };

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, autoRotate, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }

    setTouchEnd(null);
    setTouchStart(null);
  };

  return (
    <div 
      className="relative w-full"
      style={{ height: SLIDE_HEIGHT }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden h-full">
        <div 
          className="transition-transform duration-300 ease-in-out flex h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className="min-w-full px-4 flex items-center"
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
