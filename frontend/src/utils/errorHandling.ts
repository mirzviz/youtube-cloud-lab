import { z } from 'zod';

export function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors[0].message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An error occurred';
} 