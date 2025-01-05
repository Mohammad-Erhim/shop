import { NextFunction, Request, Response } from 'express';
import HTTP_STATUS from '../utils/httpStatus';
import {
  addCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/categoryService';
import { formatMessage } from '../utils/stringUtils';
import { AddCategoryPayload, UpdateCategoryPayload } from '../types/category';

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body as AddCategoryPayload;
  const translations = req.locals.languageTranslations;

  try {
    const category = await addCategoryService(
      { name, description },
      translations
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.add,
        entity: translations.entities.category,
      }),
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;

  try {
    const categories = await getCategoriesService({ page, size }, translations);

    res.status(HTTP_STATUS.OK).json({
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params as { id: string };
  const translations = req.locals.languageTranslations;

  try {
    const category = await getCategoryService(
      { id: parseInt(id) },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params as { id: string };
  const translations = req.locals.languageTranslations;

  try {
    await deleteCategoryService({ id: parseInt(id) }, translations);

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.delete,
        entity: translations.entities.category,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params as { id: string };
  const { name, description } = req.body as UpdateCategoryPayload;
  const translations = req.locals.languageTranslations;

  try {
    const updatedCategory = await updateCategoryService(
      { id: parseInt(id), name, description },
      translations
    );

    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.update,
        entity: translations.entities.category,
      }),
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
