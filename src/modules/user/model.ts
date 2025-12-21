// Model define the data structure and validation for the request and response
import { t } from 'elysia';

export namespace UserModel {
  // Google OAuth callback query params
  export const googleCallbackQuery = t.Object({
    code: t.String(),
    state: t.Optional(t.String()),
  });

  export type googleCallbackQuery = typeof googleCallbackQuery.static;

  // User response model
  export const userData = t.Object({
    id: t.String(),
    email: t.String(),
    name: t.Optional(t.String()),
    picture: t.Optional(t.String()),
    emailVerified: t.Boolean(),
    createdAt: t.String(),
    updatedAt: t.String(),
  });

  export type userData = typeof userData.static;

  // Auth response model
  export const authResponse = t.Object({
    success: t.Boolean(),
    data: t.Object({
      user: userData,
      token: t.String(),
    }),
    message: t.Optional(t.String()),
  });

  export type authResponse = typeof authResponse.static;

  // Login URL response
  export const loginUrlResponse = t.Object({
    success: t.Boolean(),
    data: t.Object({
      url: t.String(),
    }),
  });

  export type loginUrlResponse = typeof loginUrlResponse.static;
}

