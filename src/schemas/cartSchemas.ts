import { z } from 'zod';
import { initializeI18n } from '../config/i18n';

export const createCartSchemas = (lang: string) => {
  initializeI18n(lang);
  return {
    addCartItemSchema: z.object({
      productId: z.number(),
    }),
    updateCartItemSchema: z.object({
      quantity: z.number().min(1),
    }),
  };
};
