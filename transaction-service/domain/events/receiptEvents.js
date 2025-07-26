const ReceiptEventTypes = {
    PURCHASE_COMPLETED: 'PurchaseCompleted',
};

function createReceiptEvent(type, userId, payload, timestamp) {
  if (!Object.values(CartEventTypes).includes(type)) {
    throw new Error(`Invalid Cart Event Type: ${type}`);
  }

  return {
    userId,
    type,
    payload,
    timestamp
  };
}

module.exports = { ReceiptEventTypes, createReceiptEvent };