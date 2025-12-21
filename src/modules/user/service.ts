// Service handle business logic, decoupled from Elysia controller
import { prisma } from '@/config/database';
import { env } from '@/config/env';
import type { UserModel } from './model';

export abstract class UserService {
  /**
   * Generate Google OAuth login URL
   */
  static getGoogleLoginUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      ...(state && { state }),
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    id_token: string;
  }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    return (await response.json()) as {
      access_token: string;
      id_token: string;
    };
  }

  /**
   * Get user info from Google using access token
   */
  static async getGoogleUserInfo(accessToken: string): Promise<{
    id: string;
    email: string;
    name?: string;
    picture?: string;
    verified_email: boolean;
  }> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    return (await response.json()) as {
      id: string;
      email: string;
      name?: string;
      picture?: string;
      verified_email: boolean;
    };
  }

  /**
   * Find or create user from Google OAuth
   */
  static async findOrCreateUser(googleUser: {
    id: string;
    email: string;
    name?: string;
    picture?: string;
    verified_email: boolean;
  }): Promise<UserModel.userData> {
    const user = await prisma.user.upsert({
      where: {
        googleId: googleUser.id,
      },
      update: {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        emailVerified: googleUser.verified_email,
        updatedAt: new Date(),
      },
      create: {
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        picture: googleUser.picture,
        emailVerified: googleUser.verified_email,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      picture: user.picture ?? undefined,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Generate JWT token (simple implementation)
   * In production, use a proper JWT library
   */
  static generateToken(userId: string): string {
    // Simple token generation - in production, use proper JWT library
    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }
}
