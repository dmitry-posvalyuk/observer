import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'

export default sequelize.define(
  'sources',
  {
    name: {
      type: DataTypes.STRING(32),
      primaryKey: true
    }
  },
  {
    timestamps: false
  }
)
