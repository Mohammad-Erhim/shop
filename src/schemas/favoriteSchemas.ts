import { z } from 'zod';
import { initializeI18n } from '../config/i18n';

export const createFavoriteSchemas = (lang: string) => {
  initializeI18n(lang);
  return {
    addFavoriteSchema: z.object({
      productId: z.number(),
    }),
  };
};
