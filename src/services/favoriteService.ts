import Favorite from '../models/favorite';
import { LanguageTranslations } from '../types/languageTranslations';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';
import { getPagination, getPagingData } from '../utils/pagination';
import { PaginationPayload } from '../types/pagination';

export const addFavoriteService = async (
  { userId, productId }: { userId: number; productId: number },
  translations: LanguageTranslations
) => {
  const [favorite, created] = await Favorite.findOrCreate({
    where: { userId, productId },
    defaults: { userId, productId },
  });

  if (!created) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: formatMessage(translations.status.alreadyExists, {
        entity: translations.entities.favorite,
      }),
    };
  }
  return favorite;
};

export const getFavoritesService = async (
  { page, size, userId }: PaginationPayload & { userId: number },
  translations: LanguageTranslations
) => {
  const { limit, offset } = getPagination(page, size);

  const favorites = await Favorite.findAndCountAll({
    where: { userId },
    limit,
    offset,
  });

  return getPagingData(favorites, page, limit);
};
export const getFavoriteService = async (
  { userId, productId }: { userId: number; productId: number },
  translations: LanguageTranslations
) => {
  const favorite = await Favorite.findOne({
    where: { userId, productId },
  });

  if (!favorite) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.favorite,
      }),
    };
  }

  return favorite;
};

export const deleteFavoriteService = async (
  { userId, productId }: { userId: number; productId: number },
  translations: LanguageTranslations
) => {
  const favorite = await Favorite.findOne({
    where: { userId, productId },
  });

  if (!favorite) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.favorite,
      }),
    };
  }

  await favorite.destroy();
};
