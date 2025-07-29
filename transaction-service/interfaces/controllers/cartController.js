const jwt = require('jsonwebtoken');
const userServices = require('../../infrastructure/services/userServices')
require('dotenv').config();
const getCart = require('../../usecases/cart/getCart');
const addToCart = require('../../usecases/cart/addToCart');
const removeFromCart = require('../../usecases/cart/deleteFromCart');
const emptyCart = require('../../usecases/cart/emptyCart');

const secret = process.env.JWT_SECRET;

module.exports = {
  get: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Missing token' });

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, secret);
      const user = await userServices.getUserById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const cart = await getCart(user.id);
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  add: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Missing token' });

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, secret);
      const user = await userServices.getUserById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

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
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Missing token' });

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, secret);
      const user = await userServices.getUserById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({ error: 'Product ID required' });
      }

      const cart = await getCart(user.id);
      const itemExists = cart?.items?.some(item => item.product.toString() === productId);
      if (!itemExists) {
        return res.status(400).json({ error: 'Product not found in cart' });
      }

      const updatedCart = await removeFromCart(user.id, productId);
      res.status(200).json({ message: 'Product removed', cart: updatedCart });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  empty: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Missing token' });

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, secret);
      const user = await userServices.getUserById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const emptyResult = await emptyCart(user.id);
      res.status(200).json(emptyResult);
    } catch (error) {
      console.error('Error emptying cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};