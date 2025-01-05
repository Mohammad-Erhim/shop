import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import HTTP_STATUS from './httpStatus';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const translations = req.locals.languageTranslations;
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: translations.validation.validationError,
        details: error.errors.map((err: any) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
  };
