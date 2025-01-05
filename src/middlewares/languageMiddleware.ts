import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { LanguageTranslations } from '../types/languageTranslations';

const languageMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const language = req.headers['accept-language']?.split(',')[0] || 'en'; // Default to English
  const filePath = path.join(__dirname, '..', 'locales', `${language}.json`);

  // Check if the language file exists, and load it
  if (fs.existsSync(filePath)) {
    req.locals = {
      ...req.locals,
      languageTranslations: JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
      ) as LanguageTranslations,
    };
  } else {
    // Fallback to default language if the requested one doesn't exist
    req.locals = {
      ...req.locals,
      languageTranslations: JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '..', 'locales', 'en.json'),
          'utf-8'
        )
      ) as LanguageTranslations,
    };
  }

  next();
};

export default languageMiddleware;
