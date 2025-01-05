import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Lookup from './lookup';

interface ProductAttributes {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  categoryId: number | null;
  imagesUrls: string;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    'id' | 'imagesUrls' | 'discountPrice' | 'description'
  > {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public discountPrice!: number;
  public stockQuantity!: number;
  public categoryId!: number;
  public imagesUrls!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Lookup,
        key: 'id',
      },
    },
    imagesUrls: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('imagesUrls');
        try {
          return JSON.parse(rawValue);
        } catch {
          return rawValue;
        }
      },
    },
  },
  {
    sequelize,
    modelName: 'Product',
    timestamps: true,
  }
);

export default Product;
