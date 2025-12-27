import { Elysia } from 'elysia';
import { logger } from '@/middleware/logger';
import { corsMiddleware } from '@/middleware/cors';
import { errorHandler } from '@/middleware/error-handler';
import { swaggerPlugin } from '@/middleware/swagger';
import { health } from '@/modules/health';
import { user } from '@/modules/user';

export const app = new Elysia()
  .use(swaggerPlugin)
  .use(logger)
  .use(corsMiddleware)
  .get(
    '/',
    () => ({
      message: 'Welcome to Elysia API',
      version: '1.0.0',
      docs: '/openapi',
      health: '/health',
    }),
  )
  // ROUTES HERE
  .onError(errorHandler)
  .use(health)
  .use(user);

export type App = typeof app;
export default app;
