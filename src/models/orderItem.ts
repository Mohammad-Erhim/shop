import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Order from './order';
import Product from './product';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  appliedTaxes: string;
}

interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem extends Model<
  OrderItemAttributes,
  OrderItemCreationAttributes
> {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
  public appliedTaxes!: string;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    appliedTaxes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    timestamps: true,
  }
);

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

export default OrderItem;
