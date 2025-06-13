import ApiClient from './client';
import {
  VideoSchema,
  VideoListResponseSchema,
  VideoUploadUrlSchema,
  PlaybackUrlResponseSchema,
  VideoUploadRequestSchema,
  VideoRegistrationSchema,
  type Video,
  type VideoUploadUrl,
  type PlaybackUrlResponse
} from '../schemas/video';
import { VideoFileSchema } from '../schemas/file';

export const videoService = {
  async listVideos(): Promise<Video[]> {
    const response = await ApiClient.get<{ videos: Video[] }>('/listVideos', { requiresAuth: true });
    const validated = VideoListResponseSchema.parse(response);
    return validated.videos;
  },

  async getUploadUrl(filename: string): Promise<string> {
    // Validate the filename first
    VideoUploadRequestSchema.parse({ filename });
    
    const response = await ApiClient.post<VideoUploadUrl>('/upload-url', { filename }, { 
      requiresAuth: true,
      contentType: 'application/json'
    });
    
    const validated = VideoUploadUrlSchema.parse(response);
    return validated.uploadUrl;
  },

  async uploadVideo(uploadUrl: string, file: File): Promise<void> {
    // Validate the file
    VideoFileSchema.parse(file);
    
    console.log('Uploading file:', file, 'size:', file?.size);
    await ApiClient.put(uploadUrl, file, { 
      requiresAuth: false, // Presigned URLs don't need auth
      contentType: undefined // Do not set Content-Type header for S3 uploads
    });
  },

  async registerVideo(video: Omit<Video, 'createdAt'>): Promise<void> {
    const videoWithTimestamp = {
      ...video,
      createdAt: new Date().toISOString()
    };
    
    // Validate the video data
    VideoRegistrationSchema.parse(video);
    
    await ApiClient.post('/register-video', videoWithTimestamp, { 
      requiresAuth: true,
      contentType: 'application/json'
    });
  },

  async getPlaybackUrl(videoId: string): Promise<string> {
    // Validate the videoId
    VideoSchema.shape.videoId.parse(videoId);
    
    const data = await ApiClient.get<PlaybackUrlResponse>(`/get-playback-url?videoId=${videoId}`, { requiresAuth: true });
    const validated = PlaybackUrlResponseSchema.parse(data);
    return validated.playbackUrl;
  },
}; 