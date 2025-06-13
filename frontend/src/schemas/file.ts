import { z } from 'zod';

// Maximum file size (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed video MIME types
const ALLOWED_VIDEO_TYPES = ['video/mp4'] as const;

export const VideoFileSchema = z.instanceof(File)
  .refine(
    file => file.size <= MAX_FILE_SIZE,
    `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  )
  .refine(
    file => ALLOWED_VIDEO_TYPES.includes(file.type as typeof ALLOWED_VIDEO_TYPES[number]),
    'Only MP4 files are allowed'
  );

export type VideoFile = z.infer<typeof VideoFileSchema>; 