import Lookup from '../models/lookup';
import LookupType from '../models/lookupType';
import { AddCategoryPayload, UpdateCategoryPayload } from '../types/category';
import { LanguageTranslations } from '../types/languageTranslations';
import { LookupTypeEnum } from '../types/lookup';
import HTTP_STATUS from '../utils/httpStatus';
import { getPagination, getPagingData } from '../utils/pagination';
import { formatMessage } from '../utils/stringUtils';

export const addCategoryService = async (
  { name, description }: AddCategoryPayload,
  translations: LanguageTranslations
) => {
  const categoriesLookupType = await LookupType.findOne({
    where: { name: LookupTypeEnum.CATEGORIES },
  });

  if (!categoriesLookupType) {
    throw {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: translations.error.serverError,
    };
  }

  return await Lookup.create({
    type: categoriesLookupType.id,
    value: name,
    description,
  });
};

export const getCategoriesService = async (
  { page, size }: { page: number; size: number },
  translations: LanguageTranslations
) => {
  const categoriesLookupType = await LookupType.findOne({
    where: { name: LookupTypeEnum.CATEGORIES },
  });

  if (!categoriesLookupType) {
    throw {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: translations.error.serverError,
    };
  }

  const { limit, offset } = getPagination(page, size);

  const categories = await Lookup.findAndCountAll({
    where: { type: categoriesLookupType.id },
    limit,
    offset,
  });

  return getPagingData(categories, page, size);
};

export const getCategoryService = async (
  { id }: { id: number },
  translations: LanguageTranslations
) => {
  const category = await Lookup.findOne({
    where: { id },
    include: {
      model: LookupType,
      where: { name: LookupTypeEnum.CATEGORIES },
    },
  });

  if (!category) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.category,
      }),
    };
  }

  return category;
};

export const deleteCategoryService = async (
  { id }: { id: number },
  translations: LanguageTranslations
) => {
  const category = await Lookup.findOne({
    where: { id },
    include: {
      model: LookupType,
      where: { name: LookupTypeEnum.CATEGORIES },
    },
  });

  if (!category) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.category,
      }),
    };
  }

  await category.destroy();
};

export const updateCategoryService = async (
  { id, name, description }: { id: number } & UpdateCategoryPayload,
  translations: LanguageTranslations
) => {
  const category = await Lookup.findOne({
    where: { id },
    include: {
      model: LookupType,
      where: { name: LookupTypeEnum.CATEGORIES },
    },
  });

  if (!category) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.category,
      }),
    };
  }

  return await category.update({ value: name, description });
};
