import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Product = sequelize.define(
  'products',
  {
    key: {
      type: DataTypes.BIGINT,
      autoIncrement: false,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(256)
    },
    slug: {
      type: DataTypes.STRING(128)
    },
    imageUrl: {
      type: DataTypes.STRING(512)
    },
    category: {
      type: DataTypes.STRING(64)
    },
    color: {
      type: DataTypes.STRING(16)
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

export default Product
