import { Elysia } from 'elysia';
import { error } from '@/utils/response';

export const errorHandler = new Elysia({ name: 'error-handler' }).onError(
  ({ code, error: err, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      return error('Validation Error', err.message);
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return error('Not Found', 'The requested resource was not found');
    }

    if (code === 'INTERNAL_SERVER_ERROR') {
      set.status = 500;
      return error('Internal Server Error', err.message);
    }

    set.status = 500;
    return error('Unknown Error', err.message);
  },
);
