const getCart = require('../usecases/cart/getCart');
const cartRepository = require('../domain/repositories/cartRepository');

module.exports = async function(userId){
    const events = await cartRepository.getEventsByUser(userId);
    if (events.length === 0) {
        throw new Error('No items in cart to empty');
    }

    const cart = await getCart(userId);
    if (!cart || cart.items.length === 0) {
        throw new Error('No items in cart to empty');
    }

    return cart;
}