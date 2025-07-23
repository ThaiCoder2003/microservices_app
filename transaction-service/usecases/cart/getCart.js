const cartRepository = require('../../domain/repositories/cartRepository');
const productService = require('../../infrastructure/services/productServices');
const Cart = require('../../domain/entities/Cart');
module.exports = async function GetCart(userId) {
    try {
        // Fetch all cart events for the user
        const events = await cartRepository.getEventsByUser(userId);
        
        // Get product details for each event
        const cart = new Cart(userId);
        cart.applyEvents(events);

        const snapshot = cart.getAll();

        const items = await Promise.all(snapshot.items.map(async (item) => {
            const product = await productService.getProductById(item.productId);
            return{
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity
            }
        }));

        cart.totalPrice = items.reduce((total, item) => total + item.totalPrice, 0);

        // Return the cart details
        return {
            userId: cart.userId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            events: cart.events
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve cart');
    }
}