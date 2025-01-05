import { Lookup } from '../models/associations';
import LookupType from '../models/lookupType';
import Product from '../models/product';
import { LanguageTranslations } from '../types/languageTranslations';
import { LookupTypeEnum } from '../types/lookup';
import { AddProductPayload, UpdateProductPayload } from '../types/product';
import HTTP_STATUS from '../utils/httpStatus';
import { getPagination, getPagingData } from '../utils/pagination';
import { formatMessage } from '../utils/stringUtils';

export const addProductService = async (
  {
    name,
    categoryId,
    description,
    discountPrice,
    imagesUrls,
    price,
    stockQuantity,
  }: AddProductPayload,
  translations: LanguageTranslations
): Promise<Product> => {
  if (typeof categoryId == 'number') {
    const categoryLookup = await Lookup.findOne({
      where: { id: categoryId },
      include: {
        model: LookupType,
        where: { name: LookupTypeEnum.CATEGORIES },
      },
    });

    if (!categoryLookup) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        message: formatMessage(translations.status.notFound, {
          entity: translations.entities.category,
        }),
      };
    }
  }
  const product = await Product.create({
    name,
    categoryId,
    description,
    discountPrice,
    imagesUrls: JSON.stringify(imagesUrls),
    price,
    stockQuantity,
  });
  return product;
};

export const updateProductService = async (
  {
    id,
    name,
    categoryId,
    description,
    discountPrice,
    imagesUrls,
    price,
    stockQuantity,
  }: UpdateProductPayload & { id: number },
  translations: LanguageTranslations
) => {
  const product = await Product.findOne({
    where: { id },
  });
  if (!product) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.product,
      }),
    };
  }
  if (typeof categoryId == 'number') {
    const category = await Lookup.findOne({
      where: { id: categoryId },
      include: {
        model: LookupType,
        where: { name: LookupTypeEnum.CATEGORIES },
      },
    });

    if (!category) {
      throw {
        status: HTTP_STATUS.BAD_REQUEST,
        message: formatMessage(translations.status.notFound, {
          entity: translations.entities.category,
        }),
      };
    }
  }

  return product.update({
    name,
    categoryId,
    description,
    discountPrice,
    imagesUrls: JSON.stringify(imagesUrls),
    price,
    stockQuantity,
  });
};

export const getProductService = async (
  { id }: { id: number },
  translations: LanguageTranslations
) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.product,
      }),
    };
  }
  return product;
};

export const getProductsService = async (
  { page = 1, size = 10 }: { page: number; size: number },
  translations: LanguageTranslations
) => {
  const { limit, offset } = getPagination(page, size);

  const products = await Product.findAndCountAll({
    limit,
    offset,
  });

  return getPagingData(products, page, size);
};

export const deleteProductsService = async (
  { id }: { id: number },
  translations: LanguageTranslations
) => {
  const product = await Product.findByPk(id);

  if (!product) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.product,
      }),
    };
  }

  await product.destroy();
};
