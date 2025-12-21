import type { ApiResponse } from '@/types';

export const success = <T>(data: T, message?: string) => {
  const response: { success: true; data: T; message?: string } = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

export const error = (error: string, message?: string): ApiResponse => ({
  success: false,
  error,
  ...(message && { message }),
});
