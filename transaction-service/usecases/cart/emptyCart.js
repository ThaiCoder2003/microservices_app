const cartRepository = require('../../domain/repositories/cartRepository');
const getCart = require('./getCart');
const cartEvents = require('../../domain/events/cartEvents');

const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function EmptyCart(userId) {
    try {
        // Retrieve all cart events for the user
        const events = await cartRepository.getEventsByUser(userId);
        if (events.length === 0) {
            throw new Error('No items in cart to empty');
        }

        const cart = await getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error('No items in cart to empty');
        }

        // Optionally, clear the cart after purchase
        const clearCartEvent = createCartEvent(CartEventTypes.CART_CLEARED, { userId });
        await cartRepository.createEvent(clearCartEvent);

        return {
            message: "Cart successfully emptied"
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to complete purchase');
    }
}
