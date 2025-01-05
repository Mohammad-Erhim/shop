import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '../utils/httpStatus';
import {
  addFavoriteService,
  getFavoritesService,
  getFavoriteService,
  deleteFavoriteService,
} from '../services/favoriteService';
import { formatMessage } from '../utils/stringUtils';

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.body as { productId: number };
  const translations = req.locals.languageTranslations;

  try {
    const favorite = await addFavoriteService(
      { productId, userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.add,
        entity: translations.entities.favorite,
      }),
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;

  try {
    const categories = await getFavoritesService(
      { page, size, userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params as { productId: string };
  const translations = req.locals.languageTranslations;

  try {
    const favorite = await getFavoriteService(
      { userId: req.userId!, productId: parseInt(productId) },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params as { productId: string };
  const translations = req.locals.languageTranslations;

  try {
    await deleteFavoriteService(
      { userId: req.userId!, productId: parseInt(productId) },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.delete,
        entity: translations.entities.favorite,
      }),
    });
  } catch (error) {
    next(error);
  }
};
