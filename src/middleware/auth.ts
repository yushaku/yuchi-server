import { Elysia, status } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '@/config/env';

/**
 * Elysia plugin that provides JWT functionality
 * Must be used before routes that use authMiddleware
 */
export const jwtPlugin = jwt({
  name: 'jwt',
  secret: env.JWT_SECRET,
  exp: '7d',
});

/**
 * JWT authentication middleware plugin
 *
 * Validates Bearer token and extracts authUserId for use in route handlers.
 * Can be reused multiple times - Elysia automatically deduplicates plugins.
 *
 * Usage:
 * ```ts
 * .use(jwtPlugin)
 * .use(authMiddleware)
 * .get('/protected', handler)
 * ```
 */
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .onBeforeHandle(async ({ request, set, jwt }: any) => {
    if (request.method === 'OPTIONS') return;

    const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw status(401, { error: 'Unauthorized' });
    }

    const token = authHeader.slice('Bearer '.length).trim();

    try {
      const payload = await jwt.verify(token);

      if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        set.status = 401;
        throw status(401, { error: 'Invalid token' });
      }

      set.authUserId = String(payload.userId);
      return {
        authUserId: String(payload.userId),
      };
    } catch (error) {
      set.status = 401;
      throw status(401, {
        error: 'Invalid token',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  })
  .derive(async ({ request, jwt }: any) => {
    console.log('[authMiddleware] derive executing');

    if (request.method === 'OPTIONS') {
      return {};
    }

    const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');
    console.log('[authMiddleware] derive - authHeader:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[authMiddleware] derive - no auth header');
      return {};
    }

    const token = authHeader.slice('Bearer '.length).trim();
    console.log(
      '[authMiddleware] derive - token:',
      token ? `${token.substring(0, 20)}...` : 'empty',
    );

    try {
      const payload = await jwt.verify(token);
      console.log('[authMiddleware] derive - payload:', payload);

      if (payload && typeof payload === 'object' && 'userId' in payload) {
        const userId = String((payload as { userId: string }).userId);
        console.log('[authMiddleware] derive - userId extracted:', userId);
        return {
          authUserId: userId,
        };
      }
      console.log('[authMiddleware] derive - payload missing userId');
    } catch (error) {
      console.log('[authMiddleware] derive - verification error:', error);
      // Error already handled in onBeforeHandle
    }

    console.log('[authMiddleware] derive - returning empty object');
    return {};
  });
