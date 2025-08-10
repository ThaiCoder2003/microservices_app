const getCart = require('../usecases/cart/getCart');

module.exports = async function(userId){
    const cart = await getCart(userId);
    if (!cart.items.length) throw new Error('No items in cart');
    return cart;
}