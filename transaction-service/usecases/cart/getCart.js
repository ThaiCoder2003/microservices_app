const cartRepository = require('../../domain/repositories/cartRepository');
const productService = require('../../infrastructure/services/productServices');
const Cart = require('../../domain/entities/Cart');
module.exports = async function GetCart(userId) {
    try {
        // Fetch all cart events for the user
        const events = await cartRepository.getEventsByUser(userId);
        if (!events || events.length === 0 ){
            return {
                userId,
                items: [],
                totalPrice: 0
            }
        }
        
        // Get product details for each event
        const cart = new Cart(userId);
        cart.applyEvents(events);

        const snapshot = cart.getAll()
        if (snapshot.items.length === 0){
            return {
                userId,
                items: [],
                totalPrice: 0
            }
        }

        const items = await Promise.all(snapshot.items.map(async (item) => {
            const product = await productService.getProductById(item.productId);
            return{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: item.quantity,
                totalPrice: product.price * item.quantity
            }
        }));
        const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0);
        // Return the cart details
        return {
            userId,
            items,
            totalPrice,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve cart');
    }
}