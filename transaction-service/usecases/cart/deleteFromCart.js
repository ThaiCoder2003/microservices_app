const cartRepository = require('../../domain/repositories/cartRepository');
const cartEvents = require('../../domain/events/cartEvents');

const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function DeleteFromCart(userId, productId) {
    try {
        // Create a new cart event for deletion
        const event = createCartEvent(
            CartEventTypes.ITEM_ADDED, 
            userId, 
            { productId: productId }
        )
        
        // Save the event to the database
        const savedEvent = await cartRepository.createEvent(event);
        
        return {
            id: savedEvent._id,
            userId: savedEvent.userId,
            type: savedEvent.type,
            payload: savedEvent.payload,
            timestamp: savedEvent.timestamp
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to delete item from cart');
    }
}