import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'
import Customer from './Customer.js'
import Store from './Store.js'
import EventType from './EventType.js'

const Order = sequelize.define(
  'orders',
  {
    number: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: EventType,
        key: 'name'
      }
    },
    anonymousId: {
      type: DataTypes.STRING(42),
      allowNull: false,
      references: {
        model: Customer,
        key: 'anonymous_id'
      }
    },
    locale: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^[a-z]{2}-[A-Z]{2}$/
      }
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        is: /^[A-Z]{2}$/
      }
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        is: /^[A-Z]{3}$/
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store
      }
    },
    collectedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    shipedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    completedAt: DataTypes.DATE
  },
  {
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

export default Order
