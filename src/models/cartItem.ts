import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Cart from './cart';
import Product from './product';

interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, 'id'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> {
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  product?: Product;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['cartId', 'productId'],
      },
    ],
  }
);

export default CartItem;
