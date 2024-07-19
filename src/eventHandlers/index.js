import events from '../db/const/eventTypes.js'
import created from './created.js'

export default {
  [events.CREATED]: created
}
