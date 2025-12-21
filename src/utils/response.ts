import type { ApiResponse } from '@/types';

export const success = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  ...(message && { message }),
});

export const error = (error: string, message?: string): ApiResponse => ({
  success: false,
  error,
  ...(message && { message }),
});
