import React from 'react';

interface BodyPartIconsProps {
  bodyParts: string[];
  theme?: 'blue' | 'green';
  isLandscape?: boolean;
}

export const BodyPartIcons: React.FC<BodyPartIconsProps> = ({ bodyParts, theme = 'blue', isLandscape = false }) => {
  // Limit to first 4 body parts to ensure consistent layout
  const displayBodyParts = bodyParts.slice(0, 4);
  
  if (!bodyParts || bodyParts.length === 0) {
    return null;
  }

  // Compact version for landscape mode
  if (isLandscape) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
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
              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                theme === 'green'
                  ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                  : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
              }`}
              title={part}
            >
              {part}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Regular portrait mode layout
  return (
    <div className="flex flex-col">
      <span className={`text-sm font-medium mb-2 ${
        theme === 'green' 
          ? 'text-green-800 dark:text-green-200' 
          : 'text-blue-800 dark:text-blue-200'
      }`}>
        Target:
      </span>
      <div className="flex flex-wrap gap-2">
        {displayBodyParts.map((part, index) => (
          <div 
            key={index}
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              theme === 'green'
                ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
            }`}
            title={part}
          >
            {part}
          </div>
        ))}
      </div>
    </div>
  );
};
