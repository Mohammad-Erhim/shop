import { z } from 'zod';
import { initializeI18n } from '../config/i18n';

export const createProductSchemas = (lang: string) => {
  initializeI18n(lang);
  return {
    addProductSchema: z.object({
      name: z.string(),
      description: z.string().nullable().optional(),
      price: z.number(),
      discountPrice: z.number().nullable().optional(),
      stockQuantity: z.number(),
      categoryId: z.number().nullable().optional(),
      imagesUrls: z.string().url().array().nullable().optional(),
    }),
    updateProductSchema: z.object({
      name: z.string().optional(),
      description: z.string().nullable().optional(),
      price: z.number().optional(),
      discountPrice: z.number().nullable().optional(),
      stockQuantity: z.number().optional(),
      categoryId: z.number().nullable().optional(),
      imagesUrls: z.string().url().array().nullable().optional(),
    }),
  };
};
