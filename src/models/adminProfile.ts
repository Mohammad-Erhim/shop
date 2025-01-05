import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

interface AdminProfileAttributes {
  id: number;
  userId: number;
  heroImageUrls: string;
}

interface AdminProfileCreationAttributes
  extends Optional<AdminProfileAttributes, 'id' | 'heroImageUrls'> {}

class AdminProfile
  extends Model<AdminProfileAttributes, AdminProfileCreationAttributes>
  implements AdminProfileAttributes
{
  public id!: number;

  public userId!: number;
  public heroImageUrls!: string;
}

AdminProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    heroImageUrls: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'AdminProfile',
    timestamps: true,
  }
);

AdminProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default AdminProfile;
