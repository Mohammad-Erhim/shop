import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';
import Lookup from './lookup';

interface OrderAttributes {
  id: number;
  userId: number;
  document: string;
  statusId: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  public id!: number;
  public userId!: number;
  public document!: string;
  public statusId!: number;
  status?: Lookup;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    document: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lookup,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Order',
    timestamps: true,
  }
);

export default Order;
