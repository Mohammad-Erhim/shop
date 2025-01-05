// src/types/express.d.ts
import { LanguageTranslations } from './languageTranslations';

declare global {
  namespace Express {
    interface Request {
      locals: {
        languageTranslations: LanguageTranslations;
      };
      userId?: number;
    }
  }
}
