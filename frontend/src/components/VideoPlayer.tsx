import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '../api/videoService';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();

  const { data: videoUrl, isLoading, isError, error } = useQuery<string, Error>({
    queryKey: ['videoUrl', videoId],
    queryFn: () => videoService.getPlaybackUrl(videoId!),
    enabled: !!videoId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full"
          src={videoUrl}
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer; 