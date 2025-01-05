import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';
import {
  addProductService,
  deleteProductsService,
  getProductService,
  getProductsService,
  updateProductService,
} from '../services/productService';
import { AddProductPayload, UpdateProductPayload } from '../types/product';

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    categoryId,
    description,
    discountPrice,
    imagesUrls,
    price,
    stockQuantity,
  } = req.body as AddProductPayload;
  const translations = req.locals.languageTranslations;
  try {
    const product = await addProductService(
      {
        name,
        categoryId,
        description,
        discountPrice,
        imagesUrls,
        price,
        stockQuantity,
      },
      translations
    );
    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        entity: translations.entities.product,
        action: translations.actions.add,
      }),
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    categoryId,
    description,
    discountPrice,
    imagesUrls,
    price,
    stockQuantity,
  } = req.body as UpdateProductPayload;
  const id = req.params.id;

  const translations = req.locals.languageTranslations;
  try {
    const product = await updateProductService(
      {
        id: parseInt(id),
        name,
        categoryId,
        description,
        discountPrice,
        imagesUrls,
        price,
        stockQuantity,
      },
      translations
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.update,
        entity: translations.entities.product,
      }),
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const translations = req.locals.languageTranslations;

  try {
    const product = await getProductService({ id: parseInt(id) }, translations);
    res.status(HTTP_STATUS.OK).json({
      data: product,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: translations.error.serverError,
    });
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;

  try {
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    const products = await getProductsService({ page, size }, translations);

    res.status(HTTP_STATUS.OK).json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const translations = req.locals.languageTranslations;

  try {
    await deleteProductsService({ id: parseInt(id) }, translations);

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        entity: translations.entities.product,
        action: translations.actions.delete,
      }),
    });
  } catch (error) {
    next(error);
  }
};
