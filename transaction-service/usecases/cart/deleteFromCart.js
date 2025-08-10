const cartEvents = require('../../domain/events/cartEvents');
const { sendTransactionEvent } = require('../../infrastructure/kafka/transaction.producer')
const { v4: uuidv4 } = require('uuid');
const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function DeleteFromCart(userId, productId) {
    try {
        // Create a new cart event for deletion
        const cartEvent = createCartEvent(
            CartEventTypes.ITEM_REMOVED, 
            userId, 
            { productId: productId }
        )
        
        // Save the event to the database
        const eventId = uuidv4();
            // Save the event to the database
        await sendTransactionEvent(eventId, 'cart.deleted', {
            cartEvent
        })
        return { 
            status: 202,
            message: 'Request sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to delete item from cart');
    }
}