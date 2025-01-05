import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';
import Product from './product';

interface FavoriteAttributes {
  id: number;
  userId: number;
  productId: number;
}

interface FavoriteCreationAttributes
  extends Optional<FavoriteAttributes, 'id'> {}

class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> {
  public id!: number;
  public userId!: number;
  public productId!: number;
}

Favorite.init(
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Favorite',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId'],
      },
    ],
  }
);

Favorite.belongsTo(User, { foreignKey: 'userId' });

export default Favorite;
