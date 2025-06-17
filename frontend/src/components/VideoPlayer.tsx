import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '../api/videoService';
import { VideoSchema } from '../schemas/video';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: videoUrl, isLoading, isError, error } = useQuery<string, Error>({
    queryKey: ['videoUrl', videoId],
    queryFn: () => {
      if (!videoId) throw new Error('Video ID is required');
      // Validate videoId format
      VideoSchema.shape.videoId.parse(videoId);
      return videoService.getPlaybackUrl(videoId);
    },
    enabled: !!videoId,
  });

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      // Force the video to load metadata
      videoRef.current.load();
    }
  }, [videoUrl]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="aspect-video bg-black rounded-lg overflow-hidden flex justify-center items-center" style={{ height: '480px' }}>
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center p-4">
        {error?.message || 'Could not load video'}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video bg-black rounded-lg overflow-hidden" style={{ height: '480px' }}>
        <video
          ref={videoRef}
          controls
          className="w-full h-full object-contain"
          src={videoUrl}
          controlsList="nodownload"
          preload="metadata"
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer; 