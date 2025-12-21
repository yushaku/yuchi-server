// Controller handle HTTP related eg. routing, request validation
import { Elysia } from 'elysia';
import { success } from '@/utils/response';
import { HealthModel } from './model';

export const health = new Elysia({ prefix: '/health' }).get(
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
    response: {
      200: HealthModel.healthResponse,
    },
  },
);
