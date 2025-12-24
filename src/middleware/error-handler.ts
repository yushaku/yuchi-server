import { status } from 'elysia';
import { HttpException } from '@/utils/exceptions';

export const errorHandler = ({ code, error: err, set }: any) => {
  if (
    err &&
    typeof err === 'object' &&
    'statusCode' in err &&
    typeof (err as any).statusCode === 'number'
  ) {
    const httpException = err as HttpException;
    set.status = httpException.statusCode;
    return status(httpException.statusCode, {
      success: false,
      error: httpException.error || httpException.name || 'Error',
      message: httpException.message,
    });
  }

  // Also try instanceof check as fallback
  if (err instanceof HttpException) {
    set.status = err.statusCode;
    return status(err.statusCode, {
      success: false,
      error: err.error || err.name || 'Error',
      message: err.message,
    });
  }

  // Also check if code is a number (HTTP status code from Elysia)
  if (typeof code === 'number' && code >= 400 && code < 600) {
    set.status = code;
    return status(code, {
      success: false,
      error: (err instanceof Error ? err.name : 'Error') || 'Error',
      message: (err instanceof Error ? err.message : undefined) || 'An error occurred',
    });
  }

  if (code === 'VALIDATION') {
    set.status = 400;
    return status(400, {
      success: false,
      error: 'Validation Error',
      message: err.message,
    });
  }

  if (code === 'NOT_FOUND') {
    set.status = 404;
    return status(404, {
      success: false,
      error: 'Not Found',
      message: 'The requested resource was not found',
    });
  }

  if (code === 'INTERNAL_SERVER_ERROR') {
    set.status = 500;
    return status(500, {
      success: false,
      error: 'Internal Server Error',
      message: err.message,
    });
  }

  // Default to 500 for unknown errors
  set.status = 500;
  return status(500, {
    success: false,
    error: 'Internal Server Error',
    message: (err instanceof Error ? err.message : undefined) || 'An unexpected error occurred',
  });
};
