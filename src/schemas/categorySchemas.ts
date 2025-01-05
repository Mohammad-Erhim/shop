import { z } from 'zod';
import { initializeI18n } from '../config/i18n';

export const createCategorySchemas = (lang: string) => {
  initializeI18n(lang);
  return {
    addCategorySchema: z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty(),
    }),
    updateCategorySchema: z.object({
      name: z.string().nonempty().optional(),
      description: z.string().nonempty().optional(),
    }),
  };
};
