const CartEventTypes = {
  ITEM_ADDED: 'CartItemAdded',
  ITEM_REMOVED: 'CartItemRemoved',
  CART_CLEARED: 'CartCleared'
};

function createCartEvent(type, userId, payload) {
  if (!Object.values(CartEventTypes).includes(type)) {
    throw new Error(`Invalid Cart Event Type: ${type}`);
  }

  return {
    userId,
    type,
    payload,
    timestamp: Date.now()
  };
}

module.exports = { CartEventTypes, createCartEvent };