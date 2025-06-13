import { z } from 'zod';

// Base video schema
export const VideoSchema = z.object({
  videoId: z.string().uuid('Invalid video ID format'),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .transform(str => str.trim()),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .transform(str => str.trim()),
  createdAt: z.string().datetime('Invalid date format'),
  s3Key: z.string().optional()
});

// Schema for video list response
export const VideoListResponseSchema = z.object({
  videos: z.array(VideoSchema)
});

// Schema for video upload URL response
export const VideoUploadUrlSchema = z.object({
  uploadUrl: z.string().url('Invalid upload URL')
});

// Schema for playback URL response
export const PlaybackUrlResponseSchema = z.object({
  playbackUrl: z.string().url('Invalid playback URL')
});

// Schema for video upload request
export const VideoUploadRequestSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .regex(/^[a-zA-Z0-9-]+\.mp4$/, 'Filename must be a valid MP4 filename')
});

// Schema for video registration
export const VideoRegistrationSchema = z.object({
  videoId: z.string().uuid('Invalid video ID format'),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters'),
  s3Key: z.string()
});

// Type exports
export type Video = z.infer<typeof VideoSchema>;
export type VideoListResponse = z.infer<typeof VideoListResponseSchema>;
export type VideoUploadUrl = z.infer<typeof VideoUploadUrlSchema>;
export type PlaybackUrlResponse = z.infer<typeof PlaybackUrlResponseSchema>;
export type VideoUploadRequest = z.infer<typeof VideoUploadRequestSchema>;
export type VideoRegistration = z.infer<typeof VideoRegistrationSchema>; 