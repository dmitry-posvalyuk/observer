import { faker } from '@faker-js/faker'
import stores from '../src/db/const/stores.js'
import products from './products.json' assert { type: 'json' }

export const getOrderNumber = () => 'GB' + faker.string.numeric({ length: 10 })

export const getCreatedAt = refDate => faker.date.soon({ refDate })

export const chunkArray = (array, chunkSize = 0) => {
  chunkSize = faker.number.int({ min: 1, max: 3 })
  const chunks = []
  const arrayToChunk = [...array]

  if (chunkSize <= 0) return array

  while (arrayToChunk.length) {
    chunks.push(arrayToChunk.splice(0, chunkSize))
  }

  return chunks
}

export const generateLineItems = () => {
  return faker.helpers.arrayElements(products, { min: 1, max: 4 }).map(({ productKey, skus, centAmount }, index) => ({
    productKey,
    name: { 'en-GB': faker.commerce.productName() },
    productSlug: { 'en-GB': faker.lorem.slug({ min: 2, max: 6 }) + '-' + productKey },
    variant: {
      sku: skus[index] || faker.helpers.arrayElement(skus),
      images: [
        {
          url: 'https://cdn.media.amplience.net/i/primarktest/' + productKey + '_01'
        }
      ],
      attributes: [
        { name: 'skuDisplaySize', value: { 'en-GB': 'L/XL' } },
        { name: 'displayColour', value: { 'en-GB': 'Plum' } },
        { name: 'sectionName', value: { 'en-GB': 'Fashion Hosiery' } },
        { name: 'productType', value: { 'en-GB': 'Accessories' } }
      ],
      availability: {
        channels: {
          '315dd2ac-4dbf-4f6f-b444-6612a91c730c': {
            isOnStock: true,
            availableQuantity: faker.number.int({ min: 1, max: 999 })
          }
        }
      }
    },
    quantity: faker.number.int({ min: 1, max: 3 }),
    addedAt: '2024-07-17T08:12:20.591Z',
    lastModifiedAt: '2024-07-17T08:12:20.591Z',
    totalPrice: { currencyCode: 'GBP', centAmount }
  }))
}

export const generateProduct = (createdAt, orderNumber, anonymousId, lineItems) => {
  const requiredShipDate = faker.date.recent({ days: 4, refDate: createdAt })
  const collectionDate = faker.date.recent({ days: 2, refDate: createdAt })
  const centAmount = lineItems.reduce((acc, cur) => {
    acc += cur.totalPrice.centAmount
    return acc
  }, 0)

  return {
    createdAt,
    orderNumber,
    anonymousId,
    locale: 'en-GB',
    totalPrice: { currencyCode: 'GBP', centAmount },
    country: 'GB',
    orderState: 'Confirmed',
    shippingAddress: {
      custom: {
        fields: { collectionStoreId: faker.helpers.arrayElement(stores).id }
      }
    },
    lineItems,
    cart: { id: faker.string.uuid() },
    custom: {
      fields: {
        collectionDate: collectionDate.toISOString().substring(0, 10),
        requiredShipDate: requiredShipDate.toISOString().substring(0, 10),
        collectionTime: collectionDate.toTimeString().substring(0, 5)
      }
    },
    paymentInfo: {
      payments: [
        {
          obj: {
            paymentMethodInfo: { method: 'google-pay' },
            transactions: [
              {
                timestamp: '2024-07-17T08:17:49.351Z',
                type: 'Authorization',
                state: 'Initial'
              },
              {
                timestamp: '2024-07-17T08:17:51.485Z',
                type: 'Authorization',
                state: 'Pending'
              },
              {
                timestamp: '2024-07-17T08:17:52.716Z',
                type: 'Authorization',
                state: 'Success'
              }
            ]
          }
        }
      ]
    }
  }
}

export const getRefundId = orderNumber => orderNumber + '-R' + faker.string.numeric({ length: 6 })
