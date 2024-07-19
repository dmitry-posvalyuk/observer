import { sequelize, Store, Product, Order, OrderEvent, Customer, LineItem, Sku } from '../db/models/index.js'
import events from '../db/const/eventTypes.js'

const parseCustomer = anonymousId => ({
  anonymousId
})

const parseOrder = (input, anonymousId, storeId) => ({
  number: input.orderNumber,
  status: events.CREATED,
  anonymousId,
  locale: input.locale,
  price: input.totalPrice.centAmount,
  currencyCode: input.totalPrice.currencyCode,
  country: input.country,
  storeId,
  collectedAt: new Date(input.custom.fields.collectionDate + ' ' + input.custom.fields.collectionTime),
  shipedAt: input.custom.fields.requiredShipDate,
  createdAt: input.createdAt
})

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
  category: attributes.productType['en-GB'],
  section: attributes.sectionName['en-GB'],
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
  quantity: item.quantity,
  availableQuantity: Object.values(item.variant.availability.channels).reduce((acc, cur) => {
    acc += cur.availableQuantity
    return acc
  }, 0),
  createdAt: item.addedAt,
  updatedAt: item.lastModifiedAt
})

const parseCreatedPayload = input => ({
  payments: input.paymentInfo.payments.map(
    ({
      obj: {
        paymentMethodInfo: { method },
        transactions
      }
    }) => ({
      method,
      transactions: transactions.map(({ timestamp, type, state }) => ({
        timestamp,
        type,
        state
      }))
    })
  )
})

export default input => {
  try {
    return sequelize.transaction(async transaction => {
      const [store] = await Store.upsert(
        { id: parseInt(input.shippingAddress.custom.fields.collectionStoreId) },
        { transaction }
      )

      const customerPayload = parseCustomer(input.anonymousId)
      const [customer] = await Customer.upsert(customerPayload, { transaction })

      const orderPayload = parseOrder(input, customer.anonymousId, store.id)
      const order = await Order.create(orderPayload, { transaction })

      const products = await Promise.all(
        input.lineItems.map(
          item =>
            new Promise(async done => {
              const attributes = parseAttributes(item.variant.attributes)

              const productPayload = parseProduct(item, attributes)
              const [product] = await Product.upsert(productPayload, {
                fields: ['name', 'slug', 'imageUrl', 'category', 'section'],
                transaction
              })

              const skuPayload = parseSku(item, attributes)
              const [sku] = await Sku.upsert(skuPayload, { transaction })

              const lineItemPayload = parseLineItem(item, order.number, product.key, sku.sku)
              const [lineItem] = await LineItem.upsert(lineItemPayload, { transaction })
              done({ product, sku, lineItem })
            })
        )
      )

      await OrderEvent.create(
        {
          orderNumber: order.number,
          type: events.CREATED,
          payload: parseCreatedPayload(input)
        },
        { transaction }
      )

      return { customer, store, order, products }
    })
  } catch (e) {
    console.error('transaction failed', e)
  }
}
