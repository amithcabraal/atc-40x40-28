import React from 'react';
import { Dumbbell, Heart, Brain, Footprints, Armchair as Arm, Bone } from 'lucide-react';

interface BodyPartIconsProps {
  bodyParts: string[];
  theme?: 'blue' | 'green';
  isLandscape?: boolean;
}

export const BodyPartIcons: React.FC<BodyPartIconsProps> = ({ bodyParts, theme = 'blue', isLandscape = false }) => {
  const getIconForBodyPart = (bodyPart: string) => {
    const iconSize = isLandscape ? 14 : 18;
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
          {bodyParts.map((part, index) => (
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

  // Regular portrait mode layout
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${
        theme === 'green' 
          ? 'text-green-800 dark:text-green-200' 
          : 'text-blue-800 dark:text-blue-200'
      }`}>
        Target Areas:
      </span>
      <div className="flex flex-wrap gap-2">
        {bodyParts.map((part, index) => (
          <div 
            key={index}
            className={`flex items-center gap-1 ${
              theme === 'green'
                ? 'text-green-800 dark:text-green-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}
          >
            {getIconForBodyPart(part)}
          </div>
        ))}
      </div>
    </div>
  );
};