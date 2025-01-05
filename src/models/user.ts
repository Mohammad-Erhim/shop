import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Lookup from './lookup';

interface UserAttributes {
  id: number;
  userTypeId: number;
  name: string;
  password: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public userTypeId!: number;
  public name!: string;
  public password!: string;
  public email!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lookup,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

export default User;
