import { openapi } from '@elysiajs/openapi';
import { env } from '@/config/env';

export const swaggerPlugin = openapi({
  documentation: {
    info: {
      title: 'Elysia API',
      version: '1.0.0',
      description: 'API documentation for Elysia server',
    },
    tags: [
      { name: 'general', description: 'General endpoints' },
      { name: 'health', description: 'Health check endpoints' },
      { name: 'auth', description: 'Authentication endpoints' },
    ],
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
  },
});
