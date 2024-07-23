import { DataTypes } from 'sequelize'
import sequelize from './sequelize.js'
import Product from './Product.js'
import Order from './Order.js'
import Sku from './Sku.js'

const LineItem = sequelize.define(
  'lineItems',
  {
    orderNumber: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
      references: {
        model: Order,
        key: 'number'
      }
    },
    productKey: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Product,
        key: 'key'
      }
    },
    sku: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sku,
        key: 'sku'
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
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

export default LineItem
