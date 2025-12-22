// Controller handle HTTP related eg. routing, request validation
import { Elysia, status, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '@/config/env';
import { UserService } from './service';
import { UserModel } from './model';
import { success } from '@/utils/response';

export const user = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET,
      exp: '7d',
    }),
  )
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
    async ({ jwt, query, set }) => {
      try {
        const { code } = query as UserModel.googleCallbackQuery;

        if (!code) {
          set.status = 400;
          return status(400, { error: 'Authorization code is required' });
        }

        const tokens = await UserService.exchangeCodeForToken(code);
        const googleUser = await UserService.getGoogleUserInfo(tokens.access_token);
        const user = await UserService.findOrCreateUser(googleUser);
        const token = await jwt.sign({ userId: user.id });

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
          message: error instanceof Error ? error.message : 'Unknown error occurred',
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
  )
  .post(
    '/email/send-otp',
    async ({ body, set }) => {
      try {
        const { email } = body as UserModel.sendOtpRequest;

        await UserService.sendOtp(email);

        return {
          success: true,
          message: 'OTP code sent to your email',
        };
      } catch (error) {
        set.status = 400;
        return status(400, {
          error: 'Failed to send OTP',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    },
    {
      body: UserModel.sendOtpRequest,
      detail: {
        summary: 'Send OTP to Email',
        description: 'Sends a 6-digit OTP code to the provided email address',
        tags: ['auth'],
      },
      response: {
        200: UserModel.sendOtpResponse,
        400: t.Object({ error: t.String(), message: t.String() }),
      },
    },
  )
  .post(
    '/email/verify-otp',
    async ({ jwt, body, set }) => {
      try {
        const { email, code } = body as UserModel.verifyOtpRequest;

        const user = await UserService.verifyOtpAndLogin(email, code);
        const token = await jwt.sign({ userId: user.id });

        return success(
          {
            user,
            token,
          },
          'Login successful',
        );
      } catch (error) {
        set.status = 400;
        return status(400, {
          error: 'OTP verification failed',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    },
    {
      body: UserModel.verifyOtpRequest,
      detail: {
        summary: 'Verify OTP and Login',
        description: 'Verifies the OTP code and logs in the user',
        tags: ['auth'],
      },
      response: {
        200: UserModel.authResponse,
        400: t.Object({ error: t.String(), message: t.String() }),
      },
    },
  );
