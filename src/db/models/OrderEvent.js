import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'
import Order from './Order.js'
import EventType from './EventType.js'

const OrderEvent = sequelize.define(
  'orderEvents',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: Order,
        key: 'number'
      }
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: EventType,
        key: 'name'
      }
    },
    payload: DataTypes.JSON
  },
  {
    sequelize,
    updatedAt: false,
    indexes: [
      {
        fields: [
          {
            name: 'created_at',
            order: 'DESC'
          }
        ]
      }
    ]
  }
)

export default OrderEvent
