import { Elysia, status } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '@/config/env';
import { UnauthorizedException } from '@/utils/exceptions';

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
  .use(jwtPlugin)
  .derive(async ({ request, jwt }) => {
    if (request.method === 'OPTIONS') return {};

    const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {};
    }

    const token = authHeader.slice('Bearer '.length).trim();

    try {
      const payload = await jwt.verify(token);

      if (payload && typeof payload === 'object' && 'userId' in payload) {
        const userId = String((payload as { userId: string }).userId);
        return {
          authUserId: userId,
        };
      }
    } catch (error) {
      // Error already handled in onBeforeHandle
    }

    return {};
  });

/**
 * Parses cookie header string into a key-value object
 */
const parseCookies = (cookieHeader: string): Record<string, string> => {
  return cookieHeader.split(';').reduce(
    (acc, cookie) => {
      const trimmed = cookie.trim();
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex === -1) return acc;

      const key = trimmed.slice(0, equalIndex).trim();
      const value = trimmed.slice(equalIndex + 1).trim();
      if (key) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

/**
 * Extracts Bearer token from Authorization header
 */
const extractBearerToken = (authHeader: string | null): string | null => {
  if (!authHeader) return null;
  const trimmed = authHeader.trim();
  if (!trimmed.startsWith('Bearer ')) return null;
  return trimmed.slice('Bearer '.length).trim() || null;
};

/**
 * Extracts access token from request (checks cookie first, then Authorization header)
 */
const extractToken = (request: Request): string | null => {
  // Try cookie first
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader);
    if (cookies.accessToken) {
      return cookies.accessToken;
    }
  }

  // Fallback to Authorization header
  const authHeader = request.headers.get('authorization') ?? request.headers.get('Authorization');
  return extractBearerToken(authHeader);
};

/**
 * Verifies JWT token from request and returns user ID
 * Checks cookie first, then Authorization header
 *
 * @returns User ID if token is valid
 */
export const verifyToken = async ({
  request,
  jwt,
}: {
  request: Request;
  jwt: any;
}): Promise<string> => {
  const token = extractToken(request);
  if (!token) {
    throw new UnauthorizedException('Unauthorized', 'Token not found');
  }

  try {
    const payload = (await jwt.verify(token)) as { userId: string } | null;
    if (!payload || !payload.userId)
      throw new UnauthorizedException('Unauthorized', 'User ID not found in token');
    return payload.userId;
  } catch {
    throw new UnauthorizedException('Unauthorized', 'Invalid token');
  }
};
