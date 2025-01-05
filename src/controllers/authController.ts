import { NextFunction, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  refreshUserToken,
} from '../services/authService';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';
import {
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
} from '../types/auth';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, password, email } = req.body as RegisterPayload;
  const translations = req.locals.languageTranslations;

  try {
    const user = await registerUser({ name, password, email }, translations);
    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.register,
      }),
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as LoginPayload;
  const translations = req.locals.languageTranslations;

  try {
    const tokens = await loginUser({ email, password }, translations);
    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.login,
      }),
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body as RefreshTokenPayload;
  const translations = req.locals.languageTranslations;

  try {
    const tokens = refreshUserToken(refreshToken, translations);
    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.refreshToken,
      }),
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};
