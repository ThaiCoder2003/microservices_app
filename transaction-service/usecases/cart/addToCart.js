const cartRepository = require('../../domain/repositories/cartRepository');
const cartEvents = require('../../domain/events/cartEvents');

const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function AddToCart(userId, productId, quantity) {
    try {
        // Create a new cart event
        const cartEvent = createCartEvent(CartEventTypes.ITEM_ADDED, {
            userId,
            productId,
            quantity
        });
        
        // Save the event to the database
        const savedEvent = await cartRepository.createEvent(cartEvent);
        
        return {
            id: savedEvent._id,
            userId: savedEvent.userId,
            type: savedEvent.type,
            payload: savedEvent.payload,
            timestamp: savedEvent.timestamp
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to add item to cart');
    }
}