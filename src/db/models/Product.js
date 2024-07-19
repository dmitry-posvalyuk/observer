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
      type: DataTypes.STRING(256),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    section: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

export default Product
