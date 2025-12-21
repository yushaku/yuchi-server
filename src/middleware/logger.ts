import { Elysia } from 'elysia';

export const logger = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  })
  .onError(({ error, request }) => {
    console.error(
      `[${new Date().toISOString()}] Error on ${request.method} ${request.url}:`,
      error,
    );
  });
