import { sequelize, Store, Product, Order, OrderEvent, Customer, LineItem, Sku } from './db/models/index.js'
import events from './db/const/eventTypes.js'

import input from '../test/orderPlacement.json' assert { type: 'json' }

const parseCustomer = anonymousId => ({
  anonymousId
})

const parseOrder = (input, anonymousId, storeId) => {
  return {
    number: input.orderNumber,
    status: events.CREATED,
    anonymousId,
    locale: input.locale,
    totalPrice: input.totalPrice.centAmount,
    currencyCode: input.totalPrice.currencyCode,
    country: input.country,
    storeId,
    collectedAt: new Date(input.custom.fields.collectionDate + ' ' + input.custom.fields.collectionTime),
    shipedAt: input.custom.fields.requiredShipDate,
    createdAt: input.createdAt
  }
}

const parseAttributes = attributes => {
  return attributes.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {})
}

const parseProduct = (item, attributes) => ({
  key: item.productKey,
  name: item.name['en-GB'],
  slug: item.productSlug['en-GB'],
  imageUrl: item.variant.images[0].url,
  category: attributes?.productType?.['en-GB'],
  color: attributes.displayColour['en-GB']
})

const parseSku = (item, attributes) => ({
  sku: parseInt(item.variant.sku),
  productKey: item.productKey,
  size: attributes.skuDisplaySize['en-GB']
})

const parseLineItem = (item, orderNumber, productKey, sku) => ({
  orderNumber,
  productKey,
  sku,
  price: item.totalPrice.centAmount,
  quantity: item.quantity
})

const runConfirmedEvent = async () => {
  try {
    return sequelize.transaction(async transaction => {
      const customerPayload = parseCustomer(input.anonymousId)
      console.log({ customerPayload })
      const [customer] = await Customer.upsert(customerPayload, { transaction })
      console.log({ customer })

      const [store] = await Store.upsert(
        { id: parseInt(input.shippingAddress.custom.fields.collectionStoreId) },
        { transaction }
      )

      const orderPayload = parseOrder(input, customer.anonymousId, store.id)
      console.log({ orderPayload })
      const [order] = await Order.upsert(orderPayload, { transaction })
      console.log({ order })

      await Promise.all(
        input.lineItems.map(
          item =>
            new Promise(async done => {
              const attributes = parseAttributes(item.variant.attributes)

              const productPayload = parseProduct(item, attributes)
              console.log({ productPayload })
              const [product] = await Product.upsert(productPayload, { transaction })
              console.log({ product })

              const skuPayload = parseSku(item, attributes)
              console.log({ skuPayload })
              const [sku] = await Sku.upsert(skuPayload, { transaction })
              console.log({ sku })

              const lineItemPayload = parseLineItem(item, order.number, product.key, sku.sku)
              console.log({ orderProductPayload: lineItemPayload })
              const [orderProduct] = await LineItem.upsert(lineItemPayload, { transaction })
              console.log({ orderProduct })
              done()
            })
        )
      )

      await OrderEvent.create(
        {
          orderNumber: order.number,
          type: events.CREATED
        },
        { transaction }
      )
    })
  } catch (e) {
    console.error('transaction failed', e)
  }
}

runConfirmedEvent()
