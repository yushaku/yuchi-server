import { PrismaClient } from 'generated/prisma/client';
import { env } from './env';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  accelerateUrl: env.DATABASE_URL,
});
