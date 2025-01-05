import { z } from 'zod';
import { initializeI18n } from '../config/i18n';

export const createAuthSchemas = (lang: string) => {
  initializeI18n(lang);
  return {
    registerSchema: z.object({
      name: z.string().min(4),
      email: z.string().email(),
      password: z.string().min(6),
    }),

    loginSchema: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),

    refreshTokenSchema: z.object({
      refreshToken: z.string(),
    }),
  };
};
