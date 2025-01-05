import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

interface CustomerProfileAttributes {
  id: number;
  userId: number;
}

interface CustomerProfileCreationAttributes
  extends Optional<CustomerProfileAttributes, 'id'> {}

class CustomerProfile
  extends Model<CustomerProfileAttributes, CustomerProfileCreationAttributes>
  implements CustomerProfileAttributes
{
  public id!: number;
  public userId!: number;
}

CustomerProfile.init(
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
  },
  {
    sequelize,
    modelName: 'CustomerProfile',
    timestamps: true,
  }
);

CustomerProfile.belongsTo(User, { foreignKey: 'userId' });

export default CustomerProfile;
