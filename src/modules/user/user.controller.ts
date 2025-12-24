// User data controller - handles user-related endpoints
import { Elysia, status, t } from 'elysia';
import { jwtPlugin, verifyToken } from '@/middleware/auth';
import { UserService } from './service';
import { UserModel } from './model';
import { success } from '@/utils/response';

export const userController = new Elysia({ prefix: '/user' }).use(jwtPlugin).get(
  '/me',
  async ({ request, jwt }) => {
    const userId = await verifyToken({ request, jwt });
    if (!userId) {
      return status(401, { error: 'Unauthorized' });
    }

    const user = await UserService.getUserById(userId);
    if (!user) return status(404, { error: 'User not found' });
    return success({ user });
  },
  {
    detail: {
      summary: 'Get current authenticated user',
      description: 'Returns the current user',
      tags: ['user'],
      security: [{ BearerAuth: [] }],
    },
    response: {
      200: UserModel.currentUserResponse,
      401: t.Object({ error: t.String(), message: t.Optional(t.String()) }),
      404: t.Object({ error: t.String(), message: t.Optional(t.String()) }),
    },
  },
);
