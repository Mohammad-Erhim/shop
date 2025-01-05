import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import HTTP_STATUS from '../utils/httpStatus';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const translations = req.locals.languageTranslations;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: translations.auth.noAccessToken });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY!
    ) as JwtPayload;

    req.userId = decoded.userId as number;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: translations.auth.invalidOrExpiredToken,
      details: (error as Error).message,
    });
  }
};
