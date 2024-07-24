import { faker } from '@faker-js/faker'
import { sequelize, Order, OrderEvent } from '../src/db/models/index.js'
import EVENT_TYPES from '../src/db/const/eventTypes.js'
import anonymousIds from './anonymousIds.json' assert { type: 'json' }
import eventHandlers from '../src/eventHandlers/index.js'
import { getOrderNumber, getCreatedAt, chunkArray, generateLineItems, generateProduct, getRefundId } from './helpers.js'

const ordersCount = 100_000
const dayInSec = 1000 * 60 * 60 * 24
const now = Date.now()

const createOrderPipeline = async () => {
  const anonymousId = faker.helpers.arrayElement(anonymousIds)
  const orderNumber = getOrderNumber()
  const finishedOrder = new Date()
  const finishedOrdersPeriod = 90
  let createdAt = faker.date.recent({ days: finishedOrdersPeriod, refDate: finishedOrder })
  const lineItems = generateLineItems()
  const product = generateProduct(createdAt, orderNumber, anonymousId, lineItems)

  let type = EVENT_TYPES.CREATED
  try {
    return sequelize.transaction(async transaction => {
      await eventHandlers[type](product)

      if (createdAt > now - 1 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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

      if (createdAt > now - 2 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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

      if (createdAt > now - 3 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

      if (faker.datatype.boolean(0.0057)) {
        createdAt = getCreatedAt(createdAt)
        const shipmentFailed = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.SHIPMENT_FAILED,
            createdAt
          },
          { transaction }
        )
      } else {
        for (const items of chunkArray(lineItems)) {
          createdAt = getCreatedAt(createdAt)
          const shipment = await OrderEvent.create(
            {
              orderNumber,
              type: EVENT_TYPES.SHIPMENT,
              payload: items.map(i => ({ sku: i.variant.sku, quantity: i.quantity })),
              createdAt
            },
            { transaction }
          )
        }
      }

      if (createdAt > now - 4 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

      if (faker.datatype.boolean(0.0043)) {
        createdAt = getCreatedAt(createdAt)
        const dispatchFailed = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.DISPATCH_FAILED,
            createdAt
          },
          { transaction }
        )
      } else {
        createdAt = getCreatedAt(createdAt)
        type = EVENT_TYPES.DISPATCHED
        const dispatched = await OrderEvent.create(
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

      if (createdAt > now - 5 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

      if (faker.datatype.boolean(0.004)) {
        createdAt = getCreatedAt(createdAt)
        const wmsOrderConfirmationFailed = await OrderEvent.create(
          {
            orderNumber,
            type: EVENT_TYPES.WMS_ORDER_CONFIRMATION_FAILED,
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

      if (createdAt > now - 6 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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

      if (createdAt > now - 7 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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

      if (createdAt > now - 8 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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

      if (createdAt > now - 9 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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
          createdAt
        },
        { transaction }
      )

      if (createdAt > now - 10 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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
            payload: { returnId: getRefundId(orderNumber) },
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

      if (createdAt > now - 11 * dayInSec) return { type, createdAt, orderNumber, completedAt: null }

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
          payload: { returnId: getRefundId(orderNumber) },
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

for (let i = (await Order.count()) || 1; i <= ordersCount; i++) {
  const result = await createOrderPipeline()
  const { type, createdAt, orderNumber } = result
  // finalize order
  await Order.update(
    { status: type, updatedAt: createdAt, completedAt: result.completedAt === null ? null : createdAt },
    { where: { number: orderNumber } }
  )
  console.log(i + '/' + ordersCount + ' | ' + type)
}
