import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '../utils/httpStatus';
import {
  addCartItemService,
  getCartItemsService,
  updateCartItemQuantityService,
  deleteCartItemService,
  deleteCartService,
} from '../services/cartService';
import { formatMessage } from '../utils/stringUtils';

export const addCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.body as {
    productId: number;
  };
  const translations = req.locals.languageTranslations;

  try {
    const cartItem = await addCartItemService(
      { productId, userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.add,
        entity: translations.entities.cartItem,
      }),
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;

  try {
    const cartItems = await getCartItemsService(
      { page, size, userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      data: cartItems,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params as { productId: string };
  const { quantity } = req.body as {
    quantity: number;
  };
  const translations = req.locals.languageTranslations;

  try {
    const cartItem = await updateCartItemQuantityService(
      { productId: parseInt(productId), userId: req.userId!, quantity },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.update,
        entity: translations.entities.cartItem,
      }),
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params as { productId: string };
  const translations = req.locals.languageTranslations;

  try {
    await deleteCartItemService(
      { productId: parseInt(productId), userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.delete,
        entity: translations.entities.cartItem,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;

  try {
    await deleteCartService({ userId: req.userId! }, translations);

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.delete,
        entity: translations.entities.cart,
      }),
    });
  } catch (error) {
    next(error);
  }
};
