import { Elysia } from 'elysia';
import { env } from '@/config/env';
import { logger } from '@/middleware/logger';
import { corsMiddleware } from '@/middleware/cors';
import { errorHandler } from '@/middleware/error-handler';
import { swaggerPlugin } from '@/middleware/swagger';
import { routes } from '@/routes';

export const app = new Elysia()
  .use(swaggerPlugin)
  .use(logger)
  .use(corsMiddleware)
  .use(errorHandler)
  .get(
    '/',
    () => ({
      message: 'Welcome to Elysia API',
      version: '1.0.0',
      docs: '/openapi',
      health: '/health',
    }),
    {
      detail: {
        summary: 'API Welcome',
        tags: ['general'],
      },
    },
  )
  .use(routes)
  .listen(env.PORT);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 API Documentation: http://${app.server?.hostname}:${app.server?.port}/openapi`);
console.log(`💚 Health check: http://${app.server?.hostname}:${app.server?.port}/health`);

export type App = typeof app;
