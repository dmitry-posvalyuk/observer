import { defineEventByInput } from './controller.js'
import eventHandlers from './eventHandlers/index.js'

import input from '../test/orderPlacement.json' assert { type: 'json' }

const eventType = defineEventByInput(input)

if (eventType) eventHandlers[eventType](input)
