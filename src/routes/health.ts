import { Elysia } from 'elysia';
import { success } from '@/utils/response';

export const healthRoutes = new Elysia({ prefix: '/health' })
  .get(
    '/',
    () => {
      return success({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    },
    {
      detail: {
        summary: 'Health Check',
        description: 'Returns the health status of the API server',
        tags: ['health'],
      },
    },
  )
  .get(
    '/ping',
    () => {
      return success({ message: 'pong' });
    },
    {
      detail: {
        summary: 'Ping',
        description: 'Simple ping endpoint to check if the server is responding',
        tags: ['health'],
      },
    },
  );
