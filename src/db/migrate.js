import stores from './const/stores.js'
import { sequelize, Source, Store, EventType, Product, Order, OrderEvent } from './index.js'
import SOURCES from './const/sources.js'

sequelize
  .sync({
    // force: true,
    alter: true
  })
  .then(async () => {
    // sources seed
    const sourcesExists = await Source.findOne()
    if (!sourcesExists) await Source.bulkCreate(Object.keys(SOURCES).map(source => ({ name: source })))
    // event types seed
    const eventTypesExists = await EventType.findOne()
    if (!eventTypesExists) {
      const eventTypes = []
      Object.entries(SOURCES).forEach(([source, names]) => {
        names.forEach(name => {
          eventTypes.push({
            name,
            source
          })
        })
      })
      await EventType.bulkCreate(eventTypes)
    }
    // stores seed
    const storesExists = await Store.findOne()
    if (!storesExists) {
      await Store.bulkCreate(stores)
    }
    console.log('migration finished')
  })
