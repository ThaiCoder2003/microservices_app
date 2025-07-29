const cartRepository = require('../../domain/repositories/cartRepository');
const cartEvents = require('../../domain/events/cartEvents');
const checkCart = require('../../utils/checkCart')

const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function EmptyCart(userId) {
    try {
        // Retrieve all cart events for the user
        await checkCart(userId);
        // Optionally, clear the cart after purchase
        const clearCartEvent = createCartEvent(
            CartEventTypes.CART_CLEARED, 
            userId, 
            {}
        );
        await cartRepository.createEvent(clearCartEvent);

        return {
            message: "Cart successfully emptied"
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to complete purchase');
    }
}
