import { Cart, Lookup, CartItem, Order } from '../models/associations';
import { LanguageTranslations } from '../types/languageTranslations';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';
import Product from '../models/product';

import { AdjustmentType, LookupTypeEnum, OrderStatus } from '../types/lookup';
import LookupType from '../models/lookupType';
import { getPagination, getPagingData } from '../utils/pagination';

export const makeOrderService = async (
  { userId }: { userId: number },
  translations: LanguageTranslations
) => {
  const cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'cartItems',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  if (cart && cart.cartItems?.length == 0) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: formatMessage(translations.status.empty, {
        entity: translations.entities.cart,
      }),
    };
  }

  const pendingOrderStatus = await Lookup.findOne({
    where: { value: OrderStatus.PENDING },
    include: {
      model: LookupType,
      where: { name: LookupTypeEnum.ORDER_STATUS },
    },
  });

  if (!pendingOrderStatus) {
    throw {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: translations.error.serverError,
    };
  }

  const totalPrice = cart?.cartItems?.reduce((total, item: CartItem) => {
    return total + item.product!.price * item.quantity;
  }, 0);

  const report = {
    products: cart?.cartItems,
    totalPrice,
  };
  return await Order.create({
    statusId: pendingOrderStatus.id,
    document: JSON.stringify(report),
    userId,
  });
};

export const getOrdersService = async (
  { page, size, userId }: { page: number; size: number; userId: number },
  translations: LanguageTranslations
) => {
  const { limit, offset } = getPagination(page, size);

  const orders = await Order.findAndCountAll({
    where: { userId },
    include: {
      model: Lookup,
      as: 'status',
    },
    limit,
    offset,
  });

  return getPagingData(orders, page, limit);
};

export const cancelOrderService = async (
  { orderId, userId }: { orderId: number; userId: number },
  translations: LanguageTranslations
) => {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: Lookup, as: 'status' }],
  });
  if (!order) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.order,
      }),
    };
  }
  if (order.status!.value == OrderStatus.PENDING) {
    const cancelledOrderStatus = await Lookup.findOne({
      where: { value: OrderStatus.CANCELLED },
      include: {
        model: LookupType,
        where: { name: LookupTypeEnum.ORDER_STATUS },
      },
    });

    if (!cancelledOrderStatus) {
      throw null;
    }
    order.statusId = cancelledOrderStatus.id;
    await order.save();
  }
  return await order.reload();
};
