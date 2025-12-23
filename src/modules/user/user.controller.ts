// User data controller - handles user-related endpoints
import { Elysia, t } from 'elysia';
import { authMiddleware, jwtPlugin } from '@/middleware/auth';
import { UserService } from './service';
import { UserModel } from './model';
import { success } from '@/utils/response';

export const userController = new Elysia({ prefix: '/user' })
  .use(jwtPlugin)
  .use(authMiddleware)
  .get(
    '/me',
    async (ctx) => {
      const authUserId = (ctx as typeof ctx & { authUserId: string }).authUserId;

      if (!authUserId || typeof authUserId !== 'string') {
        throw new Error('User ID not found in token');
      }

      const user = await UserService.getUserById(authUserId);
      return success({ user });
    },
    {
      detail: {
        summary: 'Get current authenticated user',
        description: 'Returns the current authenticated user information',
        tags: ['user'],
      },
      response: {
        200: UserModel.currentUserResponse,
        401: t.Object({ error: t.String(), message: t.Optional(t.String()) }),
      },
    },
  );
