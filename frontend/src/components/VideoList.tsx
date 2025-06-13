import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { videoService } from '../api/videoService';
import type { Video } from '../schemas/video';

const VideoList: React.FC = () => {
  const { data: videos, isLoading, isError, error } = useQuery<Video[], Error>({
    queryKey: ['videos'],
    queryFn: () => videoService.listVideos(),
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (isError) {
    console.error('[VideoList] Query error:', error);
    return <div className="text-red-600 text-center">{error?.message || 'Could not load videos'}</div>;
  }

  return (
    <div className="space-y-4">
      {videos && videos.length === 0 ? (
        <div className="text-center text-gray-500">No videos found.</div>
      ) : (
        videos && videos.map((video) => (
          <Link 
            key={video.videoId} 
            to={`/video/${video.videoId}`}
            className="block hover:opacity-90 transition-opacity"
          >
            <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">{video.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">{video.description}</p>
              <span className="text-xs text-gray-400">{new Date(video.createdAt).toLocaleString()}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default VideoList; 