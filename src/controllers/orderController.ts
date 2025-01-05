import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '../utils/httpStatus';
import {
  makeOrderService,
  getOrdersService,
  cancelOrderService,
} from '../services/orderService';
import { formatMessage } from '../utils/stringUtils';

export const order = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;

  try {
    const order = await makeOrderService({ userId: req.userId! }, translations);

    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.add,
        entity: translations.entities.order,
      }),
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;

  try {
    const orders = await getOrdersService(
      { page, size, userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params as { id: string };
  const translations = req.locals.languageTranslations;

  try {
    const order = await cancelOrderService(
      { orderId: parseInt(id), userId: req.userId! },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
