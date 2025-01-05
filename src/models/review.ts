import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './product';
import User from './user';

interface ReviewAttributes {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  reviewText: string;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, 'id' | 'reviewText'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
  public id!: number;
  public productId!: number;
  public userId!: number;
  public rating!: number;
  public reviewText!: string;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    timestamps: true,
  }
);

Review.belongsTo(User, { foreignKey: 'userId' });

export default Review;
