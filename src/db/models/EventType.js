import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'
import Source from './Source.js'

const EventType = sequelize.define(
  'eventTypes',
  {
    name: {
      type: DataTypes.STRING(32),
      unique: true,
      primaryKey: true
    },
    source: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: Source,
        key: 'name'
      }
    }
  },
  {
    sequelize,
    timestamps: false
  }
)

export default EventType
