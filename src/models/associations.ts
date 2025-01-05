import Cart from './cart';
import CartItem from './cartItem';
import Lookup from './lookup';
import LookupType from './lookupType';
import Order from './order';
import Product from './product';

Lookup.belongsTo(LookupType, {
  foreignKey: 'type',
  onDelete: 'SET NULL',
});

Lookup.hasMany(Product, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',
});

Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  onDelete: 'CASCADE',
  as: 'cartItems',
});

CartItem.belongsTo(Product, {
  as: 'product',
});

Order.belongsTo(Lookup, {
  as: 'status',
});

export { Lookup, Cart, CartItem, Order };
