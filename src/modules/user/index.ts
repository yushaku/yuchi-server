// Main user module - merges auth and user controllers
import { Elysia } from 'elysia';
import { authController } from './auth.controller';
import { userController } from './user.controller';

// Merge both controllers into a single module
export const user = new Elysia().use(authController).use(userController);
