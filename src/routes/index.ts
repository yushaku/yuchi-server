import { Elysia } from 'elysia';
import { env } from '@/config/env';
import { healthRoutes } from '@/routes/health';
import { exampleController } from '@/controllers/example.controller';

export const routes = new Elysia({ prefix: env.API_PREFIX })
  .use(healthRoutes)
  .use(exampleController);
