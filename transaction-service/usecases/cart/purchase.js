const cartRepository = require('../../domain/repositories/cartRepository');
const cartEvents = require('../../domain/events/cartEvents');

const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function Purchase(userId) {
    try {
        // Retrieve all cart events for the user
        const cartEvents = await cartRepository.getEventsByUser(userId);
        if (cartEvents.length === 0) {
            throw new Error('No items in cart to purchase');
        }

        // Optionally, clear the cart after purchase
        const clearCartEvent = createCartEvent(CartEventTypes.CART_CLEARED, { userId });
        await cartRepository.createEvent(clearCartEvent);

        return {
            id: savedReceipt._id,
            userId: savedReceipt.userId,
            type: savedReceipt.type,
            payload: savedReceipt.payload,
            timestamp: savedReceipt.timestamp
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to complete purchase');
    }
}
