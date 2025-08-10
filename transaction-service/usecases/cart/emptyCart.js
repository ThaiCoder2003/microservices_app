const cartEvents = require('../../domain/events/cartEvents');
const checkCart = require('../../utils/checkCart')
const { v4: uuidv4 } = require('uuid');
const { sendTransactionEvent } = require('../../infrastructure/kafka/transaction.producer')
const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function EmptyCart(userId) {
    try {
        // Retrieve all cart events for the user
        await checkCart(userId);
        // Optionally, clear the cart after purchase
        const cartEvent = createCartEvent(
            CartEventTypes.CART_CLEARED, 
            userId, 
            {}
        );
        const eventId = uuidv4();
            // Save the event to the database
        await sendTransactionEvent(eventId, 'cart.cleared', {
            cartEvent
        })
        return { 
            status: 202,
            message: 'Request sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to complete purchase');
    }
}
