import { DataTypes, STRING } from 'sequelize'
import sequelize from './sequelize.js'

const Store = sequelize.define(
  'stores',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING(128),
    address: DataTypes.STRING(256),
    lat: DataTypes.DECIMAL,
    lon: DataTypes.DECIMAL,
    bins: DataTypes.SMALLINT,
    location: DataTypes.STRING(3),
    capacity: DataTypes.SMALLINT,
    orderLimit: DataTypes.SMALLINT
  },
  {
    timestamps: false
  }
)

export default Store
