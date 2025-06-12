import ApiClient from './client';

export interface Video {
  videoId: string;
  title: string;
  description: string;
  createdAt: string;
  s3Key?: string;
}

export interface VideoUploadUrl {
  uploadUrl: string;
}

interface PlaybackUrlResponse {
  playbackUrl: string;
}

export const videoService = {
  async listVideos(): Promise<Video[]> {
    const response = await ApiClient.get<{ videos: Video[] }>('/listVideos', { requiresAuth: true });
    return response.videos;
  },

  async getUploadUrl(filename: string): Promise<string> {
    const response = await ApiClient.post<VideoUploadUrl>('/upload-url', { filename }, { requiresAuth: true });
    return response.uploadUrl;
  },

  async uploadVideo(uploadUrl: string, file: File): Promise<void> {
    await ApiClient.put(uploadUrl, file, { 
      requiresAuth: false, // Presigned URLs don't need auth
      contentType: 'video/mp4'
    });
  },

  async registerVideo(video: Omit<Video, 'createdAt'>): Promise<void> {
    const videoWithTimestamp = {
      ...video,
      createdAt: new Date().toISOString()
    };
    await ApiClient.post('/register-video', videoWithTimestamp, { requiresAuth: true });
  },

  async getPlaybackUrl(videoId: string): Promise<string> {
    const data = await ApiClient.get<PlaybackUrlResponse>(`/get-playback-url?videoId=${videoId}`, { requiresAuth: true });
    console.log(data.playbackUrl);
    return data.playbackUrl;
  },
}; 