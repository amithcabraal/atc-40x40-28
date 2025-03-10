import React, { useState, useRef, useEffect } from 'react';
import { Play, Maximize } from 'lucide-react';
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
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
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

  useEffect(() => {
    // Handle pause/resume
    if (selectedMedia?.type === 'video') {
      const videoElement = videoRefs.current[selectedMedia.url];
      if (videoElement) {
        if (isPaused) {
          videoElement.pause();
        } else {
          videoElement.play().catch(console.error);
        }
      }
    }
  }, [isPaused, selectedMedia]);

  useEffect(() => {
    // Reset video errors when media changes
    setVideoErrors({});
    
    // Auto-select the first video when component mounts
    if (media && media.length > 0) {
      // Find the first video in the media array
      const firstVideo = media.find(item => item.type === 'video');
      if (firstVideo) {
        setSelectedMedia(firstVideo);
      } else if (media[0]) {
        // If no video, select the first media item
        setSelectedMedia(media[0]);
      }
    }

    // Generate thumbnails for videos that don't have explicit thumbnails
    media.forEach((item) => {
      if (item.type === 'video' && !item.thumbnail) {
        const video = document.createElement('video');
        video.src = item.url;
        video.crossOrigin = "anonymous";
        video.addEventListener('loadeddata', () => {
          video.currentTime = 0; // Seek to the first frame
        });
        video.addEventListener('seeked', () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);
            setThumbnails(prev => ({
              ...prev,
              [item.url]: canvas.toDataURL()
            }));
          } catch (error) {
            console.error('Error generating thumbnail:', error);
          }
        });
        video.addEventListener('error', (e) => {
          console.error('Error loading video:', e);
          setVideoErrors(prev => ({
            ...prev,
            [item.url]: true
          }));
        });
      }
    });

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

  // Effect to autoplay the selected video when it changes
  useEffect(() => {
    if (selectedMedia?.type === 'video' && !videoErrors[selectedMedia.url] && autoplay && !isPaused) {
      const videoElement = videoRefs.current[selectedMedia.url];
      if (videoElement) {
        videoElement.play().catch(err => {
          console.error('Error autoplaying video:', err);
          setVideoErrors(prev => ({
            ...prev,
            [selectedMedia.url]: true
          }));
        });
      }
    }
  }, [selectedMedia, videoErrors, autoplay, isPaused]);

  // Effect to handle image slideshow when video is not available
  useEffect(() => {
    // Only start the image slideshow if there are images and either no videos or all videos have errors
    const allVideosHaveErrors = videos.length > 0 && 
      videos.every(video => videoErrors[video.url]);
    
    if (images.length > 0 && (videos.length === 0 || allVideosHaveErrors)) {
      // Clear any existing interval
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }

      // Set up the image rotation with fade effect
      imageIntervalRef.current = setInterval(() => {
        // Start fade out
        setFadeDirection('out');
        
        // After fade out completes, change image and fade in
        setTimeout(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
          setFadeDirection('in');
        }, 1000); // Match the duration of the fade-out animation
      }, 5000); // Change image every 5 seconds
    }

    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }
    };
  }, [images, videos, videoErrors]);

  const handleMediaSelect = (item: Media) => {
    setSelectedMedia(item);
    
    // If it's a video, pause any currently playing videos first
    if (item.type === 'video') {
      Object.values(videoRefs.current).forEach(video => {
        if (!video.paused) {
          video.pause();
        }
      });
    }
  };

  const enterFullscreen = (videoElement: HTMLVideoElement) => {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen()
        .catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    }
  };

  const handleVideoError = (url: string) => {
    console.error('Video playback error:', url);
    setVideoErrors(prev => ({
      ...prev,
      [url]: true
    }));
  };

  if (!media?.length) return null;

  // Render image slideshow when video is not available
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

  // Check if the selected video has an error
  const hasSelectedVideoError = selectedMedia?.type === 'video' && videoErrors[selectedMedia.url];

  // Landscape mode layout for the video
  if (isLandscape) {
    return (
      <div className="w-full h-full" ref={containerRef}>
        {selectedMedia && selectedMedia.type === 'video' && !videoErrors[selectedMedia.url] && (
          <video
            ref={el => {
              if (el) videoRefs.current[selectedMedia.url] = el;
            }}
            autoPlay={autoplay}
            muted
            loop
            className="w-full h-full object-cover"
            src={selectedMedia.url}
            poster={selectedMedia.thumbnail || thumbnails[selectedMedia.url]}
            onError={() => handleVideoError(selectedMedia.url)}
          />
        )}
        {(selectedMedia && selectedMedia.type === 'image') || hasSelectedVideoError ? (
          videos.length > 0 && videos.every(video => videoErrors[video.url]) ? renderImageSlideshow() : (
            <img
              src={selectedMedia?.url || images[0]?.url}
              alt={selectedMedia?.title || 'Exercise demonstration'}
              className="w-full h-full object-cover"
              onError={(e) => console.error('Error loading image:', e)}
            />
          )
        ) : null}
        
        {!hideControls && selectedMedia && (
          <button
            onClick={() => {
              if (selectedMedia.type === 'video' && !videoErrors[selectedMedia.url]) {
                const videoElement = videoRefs.current[selectedMedia.url];
                if (videoElement) {
                  enterFullscreen(videoElement);
                }
              } else if (selectedMedia.type === 'image' || hasSelectedVideoError) {
                const img = containerRef.current?.querySelector('img');
                if (img && img.requestFullscreen) {
                  img.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                  });
                }
              }
            }}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-opacity z-10"
            aria-label="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // Regular portrait mode layout
  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      {/* Selected media display */}
      {selectedMedia && (
        <div className="rounded-lg overflow-hidden mb-2 relative flex-grow">
          {selectedMedia.type === 'video' && !videoErrors[selectedMedia.url] ? (
            <div className="relative h-full flex items-center justify-center">
              <video
                ref={el => {
                  if (el) videoRefs.current[selectedMedia.url] = el;
                }}
                controls={!hideControls}
                autoPlay={autoplay}
                muted
                loop
                className="w-full h-auto object-contain rounded-lg"
                style={{ maxHeight: '100%', height: '100%' }}
                src={selectedMedia.url}
                poster={selectedMedia.thumbnail || thumbnails[selectedMedia.url]}
                onError={() => handleVideoError(selectedMedia.url)}
              >
                Your browser does not support the video tag.
              </video>
              {!hideControls && (
                <button
                  onClick={() => {
                    const videoElement = videoRefs.current[selectedMedia.url];
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
            <div className="relative h-full flex items-center justify-center">
              {videos.length > 0 && videos.every(video => videoErrors[video.url]) ? renderImageSlideshow() : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title || 'Exercise demonstration'}
                  className="w-full h-auto object-contain rounded-lg"
                  style={{ maxHeight: '100%', height: '100%' }}
                  onError={(e) => console.error('Error loading image:', e)}
                />
              )}
              {!hideControls && (
                <button
                  onClick={() => {
                    const img = containerRef.current?.querySelector('img');
                    if (img && img.requestFullscreen) {
                      img.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                      });
                    }
                  }}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-opacity z-10"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Thumbnails row - only show if there are multiple media items and controls aren't hidden */}
      {media.length > 1 && !hideControls && (
        <div className="flex gap-2 overflow-x-auto py-1 flex-shrink-0">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMediaSelect(item)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden focus:outline-none focus:ring-2 ${
                selectedMedia === item 
                  ? theme === 'green' 
                    ? 'ring-2 ring-green-500' 
                    : 'ring-2 ring-blue-500'
                  : ''
              }`}
            >
              {item.type === 'video' ? (
                <>
                  <img
                    src={item.thumbnail || thumbnails[item.url]}
                    alt={item.title || `Media ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => console.error('Error loading thumbnail:', e)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title || `Media ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => console.error('Error loading image:', e)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};