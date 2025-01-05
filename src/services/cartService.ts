import { Cart } from '../models/associations';
import { LanguageTranslations } from '../types/languageTranslations';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';
import { getPagination, getPagingData } from '../utils/pagination';
import { PaginationPayload } from '../types/pagination';
import Product from '../models/product';
import CartItem from '../models/cartItem';

export const addCartItemService = async (
  { userId, productId }: { userId: number; productId: number },
  translations: LanguageTranslations
) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });
  const product = await Product.findOne({
    where: { id: productId },
  });
  if (!product) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.product,
      }),
    };
  }

  const [cartItem, created] = await CartItem.findOrCreate({
    where: { cartId: cart.id, productId },
    defaults: { cartId: cart.id, productId, quantity: 1 },
  });
  if (!created) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: formatMessage(translations.status.alreadyExists, {
        entity: translations.entities.cartItem,
      }),
    };
  }

  return cartItem;
};

export const getCartItemsService = async (
  { page, size, userId }: PaginationPayload & { userId: number },
  translations: LanguageTranslations
) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });

  const { limit, offset } = getPagination(page, size);

  const cartItems = await CartItem.findAndCountAll({
    where: { cartId: cart.id },
    limit,
    offset,
  });

  return getPagingData(cartItems, page, limit);
};

export const updateCartItemQuantityService = async (
  {
    userId,
    productId,
    quantity,
  }: { userId: number; productId: number; quantity: number },
  translations: LanguageTranslations
) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });

  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });

  if (!cartItem) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.cartItem,
      }),
    };
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return cartItem;
};

export const deleteCartItemService = async (
  { userId, productId }: { userId: number; productId: number },
  translations: LanguageTranslations
) => {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });

  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });

  if (!cartItem) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.cartItem,
      }),
    };
  }

  await cartItem.destroy();
};

export const deleteCartService = async (
  { userId }: { userId: number },
  translations: LanguageTranslations
) => {
  await Cart.destroy({
    where: { userId },
  });
};
