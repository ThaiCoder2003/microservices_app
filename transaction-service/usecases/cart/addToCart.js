const cartEvents = require('../../domain/events/cartEvents');
const { sendTransactionEvent } = require('../../infrastructure/kafka/transaction.producer')
const { v4: uuidv4 } = require('uuid');
const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function AddToCart(userId, productId, quantity) {
    try {
        // Create a new cart event
        const cartEvent = createCartEvent(
            CartEventTypes.ITEM_ADDED, 
            userId, 
            {
                productId,
                quantity
            }
        );
        const eventId = uuidv4();
        // Save the event to the database
        await sendTransactionEvent(eventId, 'cart.added', {
            cartEvent
        })
        
        return { 
            status: 202,
            message: 'Request sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to add item to cart');
    }
}