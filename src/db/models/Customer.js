import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Customer = sequelize.define(
  'customers',
  {
    anonymousId: {
      type: DataTypes.STRING(42),
      allowNull: false,
      primaryKey: true,
      unique: true
    }
  },
  {
    sequelize
  }
)

export default Customer
