import React, { useState, useRef, useEffect } from 'react';
import { Maximize } from 'lucide-react';
import { Media } from '../types';

interface Props {
  media: Media[];
  theme?: 'blue' | 'green';
  isLandscape?: boolean;
  hideControls?: boolean;
  autoplay?: boolean;
  isPaused?: boolean;
}

export const MediaGallery: React.FC<Props> = ({ 
  media, 
  theme = 'blue', 
  isLandscape = false,
  hideControls = false,
  autoplay = true,
  isPaused = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeDirection, setFadeDirection] = useState<'in' | 'out'>('in');
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter media to separate videos and images
  const videos = media.filter(item => item.type === 'video');
  const images = media.filter(item => item.type === 'image');
  
  // Get the primary media to display
  const primaryMedia = videos[0] || images[0];

  useEffect(() => {
    // Handle pause/resume for video
    if (primaryMedia?.type === 'video') {
      const videoElement = videoRefs.current[primaryMedia.url];
      if (videoElement) {
        if (isPaused) {
          videoElement.pause();
        } else {
          videoElement.play().catch(console.error);
        }
      }
    }
  }, [isPaused, primaryMedia]);

  useEffect(() => {
    // Reset video errors when media changes
    setVideoErrors({});

    // Add fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }
    };
  }, [media]);

  // Effect to handle image slideshow when no video is available
  useEffect(() => {
    if (images.length > 0 && videos.length === 0) {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }

      imageIntervalRef.current = setInterval(() => {
        setFadeDirection('out');
        setTimeout(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
          setFadeDirection('in');
        }, 1000);
      }, 5000);
    }

    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }
    };
  }, [images, videos]);

  const handleVideoError = (url: string) => {
    console.error('Video playback error:', url);
    setVideoErrors(prev => ({
      ...prev,
      [url]: true
    }));
  };

  const enterFullscreen = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
        .catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    }
  };

  // Render image slideshow when no video is available
  const renderImageSlideshow = () => {
    if (images.length === 0) return null;
    
    return (
      <div className="relative w-full h-full">
        <img
          src={images[currentImageIndex].url}
          alt={images[currentImageIndex].title || 'Exercise demonstration'}
          className={`w-full h-full object-contain transition-opacity duration-1000 ${
            fadeDirection === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => console.error('Error loading image:', e)}
        />
      </div>
    );
  };

  // Check if the primary video has an error
  const hasPrimaryVideoError = primaryMedia?.type === 'video' && videoErrors[primaryMedia.url];

  // Landscape mode layout
  if (isLandscape) {
    return (
      <div className="w-full h-full flex items-center justify-end" ref={containerRef}>
        <div className="relative w-full h-full max-h-[calc(100vh-6rem)] flex items-center justify-end">
          {primaryMedia?.type === 'video' && !videoErrors[primaryMedia.url] ? (
            <video
              ref={el => {
                if (el) videoRefs.current[primaryMedia.url] = el;
              }}
              autoPlay={autoplay}
              muted
              loop
              className="max-w-full max-h-full w-auto h-auto object-contain"
              src={primaryMedia.url}
              onError={() => handleVideoError(primaryMedia.url)}
            />
          ) : (
            renderImageSlideshow()
          )}
          
          {!hideControls && primaryMedia && (
            <button
              onClick={() => {
                const element = primaryMedia.type === 'video' ? 
                  videoRefs.current[primaryMedia.url] : 
                  containerRef.current?.querySelector('img');
                if (element) {
                  enterFullscreen(element);
                }
              }}
              className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-opacity z-10"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Portrait mode layout
  return (
    <div className="h-[200px]" ref={containerRef}>
      <div className="rounded-lg overflow-hidden relative h-full">
        {primaryMedia?.type === 'video' && !videoErrors[primaryMedia.url] ? (
          <div className="relative h-full flex items-center justify-center">
            <video
              ref={el => {
                if (el) videoRefs.current[primaryMedia.url] = el;
              }}
              controls={!hideControls}
              autoPlay={autoplay}
              muted
              loop
              className="w-full h-full object-contain rounded-lg"
              src={primaryMedia.url}
              onError={() => handleVideoError(primaryMedia.url)}
            >
              Your browser does not support the video tag.
            </video>
            {!hideControls && (
              <button
                onClick={() => {
                  const videoElement = videoRefs.current[primaryMedia.url];
                  if (videoElement) {
                    enterFullscreen(videoElement);
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-opacity z-10"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          renderImageSlideshow()
        )}
      </div>
    </div>
  );
};
