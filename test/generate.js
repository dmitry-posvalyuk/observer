import { faker } from '@faker-js/faker'
import stores from '../src/db/const/stores'
import { sequelize, Order, OrderEvent } from '../src/db'
import EVENT_TYPES from '../src/db/const/eventTypes'
import customers from './customers.json' assert { type: 'json' }
import skuList from './skus.json' assert { type: 'json' }

const ordersCount = 100_000

const storeIds = stores.map(s => s.id)

const getOrderNumber = () => 'GB' + faker.string.numeric({ length: 10 })

const getCreatedAt = refDate => faker.date.soon({ refDate })

const chunkArray = (array, chunkSize = 0) => {
  chunkSize = faker.number.int({ min: 1, max: 3 })
  const chunks = []
  const arrayToChunk = [...array]

  if (chunkSize <= 0) return array

  while (arrayToChunk.length) {
    chunks.push(arrayToChunk.splice(0, chunkSize))
  }

  return chunks
}

const createOrderPipeline = async () => {
  const [customerRef, customerId] = faker.helpers.arrayElement(customers)
  const orderNumber = getOrderNumber()
  const finishedOrder = new Date()
  const finishedOrdersPeriod = 90
  let createdAt = faker.date.recent({ days: finishedOrdersPeriod, refDate: finishedOrder })

  let type = EVENT_TYPES.CREATED
  try {
    return sequelize.transaction(async transaction => {
      const order = await Order.create(
        {
          number: orderNumber,
          status: type,
          customerId,
          customerRef,
          createdAt
        },
        { transaction }
      )

      createdAt = getCreatedAt(createdAt)
      const created = await OrderEvent.create(
        {
          orderNumber,
          type,
          payload: { storeId: faker.helpers.arrayElement(storeIds) },
          createdAt
        },
        { transaction }
      )

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.PAYMENT_PENDING
      const paymentPending = await OrderEvent.create(
        {
          orderNumber,
          type,
          createdAt
        },
        { transaction }
      )

      if (faker.datatype.boolean(0.007)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.CANCELLED_NO_INVENTORY
        const canceledNoInventory = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.011)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.PAYMENT_AUTH_FAILED
        const paymentAuthFailed = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.004)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.PAYMENT_CAPTURE_FAILED
        const paymentCaptureFailed = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.885)) {
          const emailPaymentCaptureFailed = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_PAYMENT_CAPTURE_FAILED,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.009)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.PAYMENT_CANCELED
        const paymentCanceled = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
        return { type, createdAt, orderNumber }
      }

      let orderItems = faker.helpers.arrayElements(skuList, { min: 1, max: 4 }).map(item => {
        return { sku: item, qty: faker.number.int({ min: 1, max: 3 }) }
      })

      if (faker.datatype.boolean(0.96)) {
        const tInitialized = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.T_INITIALIZED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      } else {
        const tInitializeFailed = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.T_INITIALIZE_FAILED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.CONFIRMED
      const confirmed = await OrderEvent.create(
        {
          orderNumber,
          type,
          payload: { orderItems },
          createdAt
        },
        { transaction }
      )

      if (faker.datatype.boolean(0.98)) {
        const emailOrderConfirmed = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_ORDER_CONFIRMED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }
      if (faker.datatype.boolean(0.97)) {
        const emailNewOrderSent = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_NEW_ORDER_SENT,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }
      if (faker.datatype.boolean(0.26)) {
        const smsNewOrderSent = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.SMS_NEW_ORDER_SENT,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      if (faker.datatype.boolean(0.0057)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.SHIPMENT_FAILED
        const shipmentFailed = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
      } else {
        chunkArray(orderItems).forEach(async payload => {
          createdAt = getCreatedAt(createdAt)
          type = EVENT_TYPES.SHIPMENT
          const shipment = await OrderEvent.create(
            {
              orderNumber,
              type,
              payload,
              createdAt
            },
            { transaction }
          )
        })
      }

      if (faker.datatype.boolean(0.0043)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.DISPATCH_FAILED
        const dispatchFailed = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
      } else {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.DISPATCH
        const dispatch = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.98)) {
          const emailOrderDispatched = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_ORDER_DISPATCHED,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }
      }

      if (faker.datatype.boolean(0.004)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.WMS_ORDER_CONFIRMATION_FAILED
        const wmsOrderConfirmationFailed = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
      }

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.PAYMENT_PENDING_CAPTURE
      const paymentPendingCapture = await OrderEvent.create(
        {
          orderNumber,
          type,
          createdAt
        },
        { transaction }
      )

      if (faker.datatype.boolean(0.26)) {
        const smsNewOrderRequested = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.SMS_NEW_ORDER_REQUESTED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      if (faker.datatype.boolean(0.53)) {
        const emailNewOrderOpened = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_NEW_ORDER_OPENED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      if (faker.datatype.boolean(0.008)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.UNFULFILLED
        const unfulfilled = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.967)) {
          const emailUnfulfilled = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_UNFULFILLED,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        if (faker.datatype.boolean(0.006)) {
          createdAt = getCreatedAt(createdAt)
          type = EVENT_TYPES.AUTHORISATION_CANCEL_FAILED
          const authorisationCancelFailed = await OrderEvent.create(
            {
              orderNumber,
              type,
              createdAt
            },
            { transaction }
          )
        } else {
          createdAt = getCreatedAt(createdAt)
          type = EVENT_TYPES.AUTHORISATION_CANCELED
          const authorisationCanceled = await OrderEvent.create(
            {
              orderNumber,
              type,
              createdAt
            },
            { transaction }
          )
        }
        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.011)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.DISPATCHED_PARCEL_MISMATCH
        const dispatchedParcelMismatch = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.973)) {
          const emailOrderDispatchParcelMismatch = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_ORDER_DISPATCH_PARCEL_MISMATCH,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.011)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.CANCELED_LOST_IN_TRANSIT
        const canceledLostInTransit = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.99)) {
          const emailCancelledLostInTransit = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_CANCELED_LOST_IN_TRANSIT,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.023)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.READY_TO_COLLECT_PARTIALLY
        const readyToCollectPartially = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.984)) {
          const emailLostInTransitPartially = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_LOST_IN_TRANSIT_PARTIALLY,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }
      } else {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.READY_TO_COLLECT
        const readyToCollect = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
      }

      if (faker.datatype.boolean(0.95)) {
        const emailReadyToCollect = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_READY_TO_COLLECT,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      if (faker.datatype.boolean(0.03)) {
        const tCollectFailed = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.T_COLLECTED_FAILED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.98)) {
          const emailRefundUncollected = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_REFUND_UNCOLLECTED,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.CANCELED
        const canceled = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )
        return { type, createdAt, orderNumber }
      }

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.COLLECTED
      const collected = await OrderEvent.create(
        {
          orderNumber,
          type,
          createdAt
        },
        { transaction }
      )

      if (faker.datatype.boolean(0.99)) {
        createdAt = getCreatedAt(createdAt)
        const emailCollectionReminder1 = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_COLLECTION_REMINDER1,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.4)) {
          createdAt = getCreatedAt(createdAt)
          const emailCollectionReminder2 = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_COLLECTION_REMINDER2,
              createdAt
            },
            { transaction }
          )

          if (faker.datatype.boolean(0.12)) {
            createdAt = getCreatedAt(createdAt)
            const emailCollectionReminder3 = await OrderEvent.create(
              {
                orderNumber,
                type: EVENT_TYPES.EMAIL_COLLECTION_REMINDER3,
                createdAt
              },
              { transaction }
            )
          }
        }
      }

      if (faker.datatype.boolean(0.962)) {
        const emailCollected = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_COLLECTED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      if (faker.datatype.boolean(0.98)) {
        const emailOrderCompletedSent = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_ORDER_COMPLETED_SENT,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      const tCollected = await OrderEvent.create(
        {
          orderNumber,
          type: EVENT_TYPES.T_COLLECTED,
          createdAt: getCreatedAt(createdAt)
        },
        { transaction }
      )

      // finished after collected
      if (faker.datatype.boolean(0.94)) {
        if (faker.datatype.boolean(0.54)) {
          const emailOrderCompletedOpened = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_ORDER_COMPLETED_OPENED,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        return { type, createdAt, orderNumber }
      }

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.RETURN_CREATED
      const returnCreated = await OrderEvent.create(
        {
          orderNumber,
          type,
          payload: { returned: [orderNumber + '-R' + faker.string.numeric({ length: 6 })] },
          createdAt
        },
        { transaction }
      )

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.PENDING_REFUND
      const pendingRefund = await OrderEvent.create(
        {
          orderNumber,
          type,
          createdAt
        },
        { transaction }
      )

      if (faker.datatype.boolean(0.021)) {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.REFUND_FAILED
        const refundFailed = await OrderEvent.create(
          {
            orderNumber,
            type,
            createdAt
          },
          { transaction }
        )

        if (faker.datatype.boolean(0.93)) {
          const tRefundFailed = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.T_REFUNDED_FAILED,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        if (faker.datatype.boolean(0.98)) {
          const emailRefundFailure = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.EMAIL_REFUND_FAILURE,
              createdAt: getCreatedAt(createdAt)
            },
            { transaction }
          )
        }

        return { type, createdAt, orderNumber }
      }

      if (faker.datatype.boolean(0.939)) {
        const emailRefundConfirmation = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.EMAIL_REFUND_CONFIRMATION,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      createdAt = getCreatedAt(createdAt)
      type = EVENT_TYPES.REFUND_SUCCESS
      const refundSuccess = await OrderEvent.create(
        {
          orderNumber,
          type,
          createdAt
        },
        { transaction }
      )

      if (faker.datatype.boolean(0.983)) {
        const tRefunded = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.T_REFUNDED,
            createdAt: getCreatedAt(createdAt)
          },
          { transaction }
        )
      }

      return { type, createdAt, orderNumber }
    })
  } catch (e) {
    console.error('transaction failed', e)
  }
}

for (let i = 1; i <= ordersCount; i++) {
  const { type, createdAt, orderNumber } = await createOrderPipeline()
  // finalize order
  await Order.update({ status: type, updatedAt: createdAt, completedAt: createdAt }, { where: { number: orderNumber } })
  console.log(i + '/' + ordersCount + ' | ' + type)
}
