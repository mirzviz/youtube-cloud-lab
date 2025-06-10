import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Video {
  videoId: string;
  title: string;
  description: string;
  createdAt: string;
}

async function fetchVideos(): Promise<Video[]> {
  const res = await fetch('https://7ehv3qnn63.execute-api.eu-north-1.amazonaws.com/dev/listVideos');
  if (!res.ok) throw new Error('Failed to fetch videos');
  const data = await res.json();
  return data.videos || [];
}

const VideoList: React.FC = () => {
  const { data: videos, isLoading, isError, error } = useQuery<Video[], Error>({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    initialData: [],
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
    return <div className="text-red-600 text-center">{error?.message || 'Could not load videos'}</div>;
  }

  return (
    <div className="space-y-4">
      {videos.length === 0 ? (
        <div className="text-center text-gray-500">No videos found.</div>
      ) : (
        videos.map((video) => (
          <div key={video.videoId} className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">{video.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-1">{video.description}</p>
            <span className="text-xs text-gray-400">{new Date(video.createdAt).toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoList; 