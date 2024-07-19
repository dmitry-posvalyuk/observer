import events from './db/const/eventTypes.js'

export const defineEventByInput = input => {
  if (input.orderState === 'Confirmed') return events.CREATED
  else {
    console.info('undefined event captured')
    return null
  }
}
