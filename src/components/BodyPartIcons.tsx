import React from 'react';
import { Dumbbell, Heart, Brain, Footprints, Armchair as Arm, Bone } from 'lucide-react';

interface BodyPartIconsProps {
  bodyParts: string[];
  theme?: 'blue' | 'green';
  isLandscape?: boolean;
}

export const BodyPartIcons: React.FC<BodyPartIconsProps> = ({ bodyParts, theme = 'blue', isLandscape = false }) => {
  // Limit to first 4 body parts to ensure consistent layout
  const displayBodyParts = bodyParts.slice(0, 4);
  
  const getIconForBodyPart = (bodyPart: string) => {
    // Scale icon size based on available space
    const iconSize = isLandscape ? 14 : 16;
    const iconClassName = `${
      theme === 'green' 
        ? 'text-green-700 dark:text-green-300' 
        : 'text-blue-700 dark:text-blue-300'
    }`;

    switch (bodyPart.toLowerCase()) {
      case 'legs':
        return <Footprints size={iconSize} className={iconClassName} />;
      case 'arms':
        return <Arm size={iconSize} className={iconClassName} />;
      case 'core':
      case 'abs':
        return <Dumbbell size={iconSize} className={iconClassName} />;
      case 'full body':
        return <Heart size={iconSize} className={iconClassName} />;
      case 'back':
        return <Bone size={iconSize} className={iconClassName} />;
      case 'chest':
        return <Dumbbell size={iconSize} className={iconClassName} />;
      case 'shoulders':
        return <Arm size={iconSize} className={iconClassName} />;
      case 'glutes':
        return <Bone size={iconSize} className={iconClassName} />;
      case 'obliques':
        return <Dumbbell size={iconSize} className={iconClassName} />;
      case 'lower back':
        return <Bone size={iconSize} className={iconClassName} />;
      case 'hamstrings':
        return <Footprints size={iconSize} className={iconClassName} />;
      case 'triceps':
        return <Arm size={iconSize} className={iconClassName} />;
      case 'inner thighs':
        return <Footprints size={iconSize} className={iconClassName} />;
      case 'hips':
        return <Bone size={iconSize} className={iconClassName} />;
      default:
        return <Brain size={iconSize} className={iconClassName} />;
    }
  };

  if (!bodyParts || bodyParts.length === 0) {
    return null;
  }

  // Compact version for landscape mode
  if (isLandscape) {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
        theme === 'green' 
          ? 'bg-green-100/80 dark:bg-green-900/80' 
          : 'bg-blue-100/80 dark:bg-blue-900/80'
      }`}>
        <span className={`text-xs font-medium ${
          theme === 'green' 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-blue-800 dark:text-blue-200'
        }`}>
          Target:
        </span>
        <div className="flex flex-wrap gap-1">
          {displayBodyParts.map((part, index) => (
            <div 
              key={index}
              className={`flex items-center ${
                theme === 'green'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}
              title={part}
            >
              {getIconForBodyPart(part)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Regular portrait mode layout with 5-slot grid system
  return (
    <div className="flex items-center">
      <span className={`text-sm font-medium mr-2 ${
        theme === 'green' 
          ? 'text-green-800 dark:text-green-200' 
          : 'text-blue-800 dark:text-blue-200'
      }`}>
        Target:
      </span>
      <div className="grid grid-cols-5 gap-x-3 w-full max-w-xs">
        {displayBodyParts.map((part, index) => (
          <div 
            key={index}
            className={`flex items-center ${
              theme === 'green'
                ? 'text-green-800 dark:text-green-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}
            title={part}
          >
            {getIconForBodyPart(part)}
          </div>
        ))}
        {/* Add empty placeholders to maintain grid structure */}
        {Array(5 - displayBodyParts.length).fill(0).map((_, i) => (
          <div key={`empty-${i}`} className="w-4 h-4"></div>
        ))}
      </div>
    </div>
  );
};