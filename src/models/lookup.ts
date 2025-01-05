import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import LookupType from './lookupType';

interface LookupAttributes {
  id: number;
  type: number;
  value: string;
  description: string;
}

interface LookupCreationAttributes
  extends Optional<LookupAttributes, 'id' | 'description'> {}

class Lookup extends Model<LookupAttributes, LookupCreationAttributes> {
  public id!: number;
  public type!: number;
  public value!: string;
  public description?: string;
}

Lookup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LookupType,
        key: 'id',
      },
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Lookup',
    timestamps: true,
  }
);

export default Lookup;
