import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

const Store = sequelize.define(
  'stores',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING(64),
    lat: DataTypes.DECIMAL,
    lon: DataTypes.DECIMAL
  },
  {
    timestamps: false
  }
)

export default Store
