import EVENT_TYPES from './eventTypes.js'

export default {
  checkout: [EVENT_TYPES.CREATED],
  fluent: [
    EVENT_TYPES.PAYMENT_PENDING,
    EVENT_TYPES.CONFIRMED,
    EVENT_TYPES.SHIPMENT,
    EVENT_TYPES.DISPATCH,
    EVENT_TYPES.PAYMENT_PENDING_CAPTURE,
    EVENT_TYPES.READY_TO_COLLECT,
    EVENT_TYPES.READY_TO_COLLECT_PARTIALLY,
    EVENT_TYPES.COLLECTED,
    EVENT_TYPES.RETURN_CREATED,
    EVENT_TYPES.PENDING_REFUND,
    EVENT_TYPES.REFUND_SUCCESS,
    EVENT_TYPES.CANCELED,
    EVENT_TYPES.CANCELLED_NO_INVENTORY,
    EVENT_TYPES.PAYMENT_AUTH_FAILED,
    EVENT_TYPES.PAYMENT_CAPTURE_FAILED,
    EVENT_TYPES.PAYMENT_CANCELED,
    EVENT_TYPES.UNFULFILLED,
    EVENT_TYPES.AUTHORISATION_CANCELED,
    EVENT_TYPES.AUTHORISATION_CANCEL_FAILED,
    EVENT_TYPES.DISPATCHED_PARCEL_MISMATCH,
    EVENT_TYPES.CANCELED_LOST_IN_TRANSIT,
    EVENT_TYPES.REFUND_FAILED,
    EVENT_TYPES.WMS_ORDER_CONFIRMATION_FAILED,
    EVENT_TYPES.SHIPMENT_FAILED,
    EVENT_TYPES.DISPATCH_FAILED,
    EVENT_TYPES.T_INITIALIZED,
    EVENT_TYPES.T_INITIALIZE_FAILED,
    EVENT_TYPES.T_COLLECTED,
    EVENT_TYPES.T_COLLECTED_FAILED,
    EVENT_TYPES.T_REFUNDED,
    EVENT_TYPES.T_REFUNDED_FAILED
  ],
  oms: [
    EVENT_TYPES.EMAIL_ORDER_CONFIRMED,
    EVENT_TYPES.EMAIL_ORDER_DISPATCHED,
    EVENT_TYPES.EMAIL_ORDER_DISPATCH_PARCEL_MISMATCH,
    EVENT_TYPES.EMAIL_READY_TO_COLLECT,
    EVENT_TYPES.EMAIL_COLLECTED,
    EVENT_TYPES.EMAIL_REFUND_CONFIRMATION,
    EVENT_TYPES.EMAIL_REFUND_FAILURE,
    EVENT_TYPES.EMAIL_REFUND_UNCOLLECTED,
    EVENT_TYPES.EMAIL_CANCELED_LOST_IN_TRANSIT,
    EVENT_TYPES.EMAIL_PAYMENT_CAPTURE_FAILED,
    EVENT_TYPES.EMAIL_UNFULFILLED,
    EVENT_TYPES.EMAIL_LOST_IN_TRANSIT_PARTIALLY,
    EVENT_TYPES.EMAIL_COLLECTION_REMINDER1,
    EVENT_TYPES.EMAIL_COLLECTION_REMINDER2,
    EVENT_TYPES.EMAIL_COLLECTION_REMINDER3
  ],
  salesforce: [
    EVENT_TYPES.EMAIL_NEW_ORDER_SENT,
    EVENT_TYPES.EMAIL_NEW_ORDER_OPENED,
    EVENT_TYPES.EMAIL_ORDER_COMPLETED_SENT,
    EVENT_TYPES.EMAIL_ORDER_COMPLETED_OPENED,
    EVENT_TYPES.SMS_NEW_ORDER_SENT,
    EVENT_TYPES.SMS_NEW_ORDER_REQUESTED
  ]
}