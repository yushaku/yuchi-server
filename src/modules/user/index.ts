// Controller handle HTTP related eg. routing, request validation
import { Elysia, status, t } from 'elysia';
import { UserService } from './service';
import { UserModel } from './model';
import { success } from '@/utils/response';

export const user = new Elysia({ prefix: '/auth' })
  .get(
    '/google',
    () => {
      const url = UserService.getGoogleLoginUrl();
      return success({ url });
    },
    {
      detail: {
        summary: 'Get Google Login URL',
        description: 'Returns the Google OAuth login URL',
        tags: ['auth'],
      },
      response: {
        200: UserModel.loginUrlResponse,
      },
    },
  )
  .get(
    '/google/callback',
    async ({ query, set }) => {
      try {
        const { code } = query as UserModel.googleCallbackQuery;

        if (!code) {
          set.status = 400;
          return status(400, { error: 'Authorization code is required' });
        }

        // Exchange code for token
        const tokens = await UserService.exchangeCodeForToken(code);

        // Get user info from Google
        const googleUser = await UserService.getGoogleUserInfo(
          tokens.access_token,
        );

        // Find or create user
        const user = await UserService.findOrCreateUser(googleUser);

        // Generate JWT token
        const token = UserService.generateToken(user.id);

        return success(
          {
            user,
            token,
          },
          'Login successful',
        );
      } catch (error) {
        set.status = 500;
        return status(500, {
          error: 'Authentication failed',
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    },
    {
      query: UserModel.googleCallbackQuery,
      detail: {
        summary: 'Google OAuth Callback',
        description: 'Handles Google OAuth callback and creates/updates user',
        tags: ['auth'],
      },
      response: {
        200: UserModel.authResponse,
        400: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String(), message: t.String() }),
      },
    },
  );

