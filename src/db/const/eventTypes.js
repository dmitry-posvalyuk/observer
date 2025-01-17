export default {
  // expected events
  CREATED: 'created',
  PAYMENT_PENDING: 'paymentPending',
  CONFIRMED: 'confirmed',
  PAYMENT_PENDING_CAPTURE: 'paymentPendingCapture',
  READY_TO_COLLECT: 'readyToCollect',
  READY_TO_COLLECT_PARTIALLY: 'readyToCollectPartially',
  COLLECTED: 'collected',
  // return events
  RETURN_CREATED: 'returnCreated',
  PENDING_REFUND: 'pendingRefund',
  REFUND_SUCCESS: 'refundSuccess',
  // cancel events
  CANCELED: 'canceled',
  // issues
  CANCELLED_NO_INVENTORY: 'cancelledNoInventory',
  PAYMENT_AUTH_FAILED: 'paymentAuthFailed',
  PAYMENT_CAPTURE_FAILED: 'paymentCaptureFailed',
  PAYMENT_CANCELED: 'paymentCanceled',
  UNFULFILLED: 'unfulfilled',
  AUTHORISATION_CANCELED: 'authorisationCanceled',
  AUTHORISATION_CANCEL_FAILED: 'authorisationCancelFailed',
  DISPATCHED_PARCEL_MISMATCH: 'dispatchedParcelMismatch',
  CANCELED_LOST_IN_TRANSIT: 'canceledLostInTransit',
  DISPATCHED: 'dispatched',
  REFUND_FAILED: 'refundFailed',
  // warnings
  WMS_ORDER_CONFIRMATION_FAILED: 'wmsOrderConfirmationFailed',
  SHIPMENT: 'shipment',
  SHIPMENT_FAILED: 'shipmentFailed',
  DISPATCHED: 'dispatched',
  DISPATCH_FAILED: 'dispatchFailed',
  // notification events
  EMAIL_ORDER_CONFIRMED: 'emailOrderConfirmed',
  EMAIL_ORDER_DISPATCHED: 'emailOrderDispatched',
  EMAIL_ORDER_DISPATCH_PARCEL_MISMATCH: 'emailOrderDispatchParcelMismatch',
  EMAIL_READY_TO_COLLECT: 'emailReadyToCollect',
  EMAIL_COLLECTED: 'emailCollected',
  EMAIL_REFUND_CONFIRMATION: 'emailRefundConfirmation',
  EMAIL_REFUND_FAILURE: 'emailRefundFailure',
  EMAIL_REFUND_UNCOLLECTED: 'emailRefundUncollected',
  EMAIL_CANCELED_LOST_IN_TRANSIT: 'emailCancelledLostInTransit',
  EMAIL_PAYMENT_CAPTURE_FAILED: 'emailPaymentCaptureFailed',
  EMAIL_UNFULFILLED: 'emailUnfulfilled',
  EMAIL_LOST_IN_TRANSIT_PARTIALLY: 'emailLostInTransitPartially',
  EMAIL_COLLECTION_REMINDER1: 'emailCollectionReminder1',
  EMAIL_COLLECTION_REMINDER2: 'emailCollectionReminder2',
  EMAIL_COLLECTION_REMINDER3: 'emailCollectionReminder3',
  // transactional log events
  T_INITIALIZED: 'tInitialized',
  T_INITIALIZE_FAILED: 'tInitializeFailed',
  T_COLLECTED: 'tCollected',
  T_COLLECTED_FAILED: 'tCollectFailed',
  T_REFUNDED: 'tRefunded',
  T_REFUNDED_FAILED: 'tRefundFailed',
  // Salesforce log events
  EMAIL_NEW_ORDER_SENT: 'emailNewOrderSent',
  EMAIL_NEW_ORDER_OPENED: 'emailNewOrderOpened',
  EMAIL_ORDER_COMPLETED_SENT: 'emailOrderCompletedSent',
  EMAIL_ORDER_COMPLETED_OPENED: 'emailOrderCompletedOpened',
  SMS_NEW_ORDER_SENT: 'smsNewOrderSent',
  SMS_NEW_ORDER_REQUESTED: 'smsNewOrderRequested'
}
