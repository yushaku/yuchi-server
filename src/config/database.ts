import { PrismaClient } from 'generated/prisma/client';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg';
import { env } from './env';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPostgresAdapter({
  connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
