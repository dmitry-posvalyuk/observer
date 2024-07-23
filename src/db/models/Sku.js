import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'
import Product from './Product.js'

const Sku = sequelize.define(
  'skus',
  {
    sku: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true,
      unique: true
    },
    productKey: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Product,
        key: 'key'
      }
    },
    size: {
      type: DataTypes.STRING(8)
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

export default Sku
