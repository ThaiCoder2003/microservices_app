const jwt = require('jsonwebtoken');
const userServices = require('../../infrastructure/services/userServices')

const getCart = require('../../usecases/cart/getCart');
const addToCart = require('../../usecases/cart/addToCart');
const removeFromCart = require('../../usecases/cart/deleteFromCart');
const purchase = require('../../usecases/cart/purchase');

module.exports = {
    get: async (req, res) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
        
            const token = authHeader.replace('Bearer ', '');
            const user = await userServices.getUserById(token);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
        
            const cart = await getCart(user.id);
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    add: async (req, res) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authToken.replace('Bearer ', '');
            const decodedUserID = jwt.verify(token, process.env.JWT_SECRET).id;

            const user = await userServices.getUserById(decodedUserID);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { productId, quantity } = req.body;
            if (!productId || !quantity) {
                return res.status(400).json({ error: 'Product ID and quantity are required' });
            }

            const updatedCart = await addToCart(user.id, productId, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    delete: async (req, res) => {
        try{
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authToken.replace('Bearer ', '');
            const decodedUserID = jwt.verify(token, process.env.JWT_SECRET).id;

            const user = await userServices.getUserById(decodedUserID);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ error: 'You must provide a product ID to remove from the cart' });
            }

            const cart = await getCart(user.id);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            // Check if the item is in the cart
            const itemExists = cart.items.some(item => item.product.toString() === productId);
            if (!itemExists) {
                return res.status(400).json({ error: 'Product not found in cart' });
            }

            // Item exists, proceed to remove it
            const updatedCart = await removeFromCart(user.id, productId);
            res.status(200).json({
                message: 'Product removed from cart successfully',
                cart: updatedCart
            });
        }
        catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    purchase: async (req, res) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authToken.replace('Bearer ', '');
            const decodedUserID = jwt.verify(token, process.env.JWT_SECRET).id;

            const user = await userServices.getUserById(decodedUserID);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Ensure the user has a cart and items to purchase
            const cart = await getCart(user.id);
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            // Proceed with the purchase
            const purchaseResult = await purchase(user.id);
            res.status(200).json(purchaseResult);
        } catch (error) {
            console.error('Error during purchase:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}