// Controller handle HTTP related eg. routing, request validation
import { Elysia } from 'elysia';
import { prisma } from '@/config/database';
import { getRedis } from '@/config/redis';
import { HealthModel } from './model';

export const health = new Elysia({ prefix: '/health' }).get(
  '/',
  async () => {
    const timestamp = new Date().toISOString();

    // Default statuses
    let postgresStatus: 'ok' | 'error' = 'ok';
    let redisStatus: 'ok' | 'error' = 'ok';

    // Check PostgreSQL
    try {
      // Lightweight query just to ensure connection is healthy
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      postgresStatus = 'error';
      console.error('[HealthCheck] PostgreSQL connection error:', error);
    }

    // Check Redis
    try {
      const redis = getRedis();
      await redis.ping();
    } catch (error) {
      redisStatus = 'error';
      console.error('[HealthCheck] Redis connection error:', error);
    }

    const overallStatus = postgresStatus === 'ok' && redisStatus === 'ok' ? 'ok' : 'degraded';

    return {
      success: true,
      data: {
        status: overallStatus,
        timestamp,
        uptime: process.uptime(),
        services: {
          postgres: postgresStatus,
          redis: redisStatus,
        },
      },
    };
  },
  {
    detail: {
      summary: 'Health Check',
      description:
        'Returns the health status of the API server, including PostgreSQL and Redis connectivity',
      tags: ['health'],
    },
    response: {
      200: HealthModel.healthResponse,
    },
  },
);
