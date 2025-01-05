import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LookupTypeAttributes {
  id: number;
  name: string;
}

interface LookupTypeCreationAttributes
  extends Optional<LookupTypeAttributes, 'id'> {}

class LookupType extends Model<
  LookupTypeAttributes,
  LookupTypeCreationAttributes
> {
  public id!: number;
  public name!: string;
}

LookupType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'LookupType',
    timestamps: true,
  }
);

export default LookupType;
