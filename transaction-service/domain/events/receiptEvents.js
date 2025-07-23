const ReceiptEventTypes = {
    PURCHASE_COMPLETED: 'PurchaseCompleted',
};

function createReceiptEvent(type, userId, payload) {
  if (!Object.values(CartEventTypes).includes(type)) {
    throw new Error(`Invalid Cart Event Type: ${type}`);
  }

  return {
    userId,
    type,
    payload,
    timestamp: new Date()
  };
}

module.exports = { ReceiptEventTypes, createReceiptEvent };