const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/products', productController.list); // Route to get all products
router.get('/products/:id', productController.get); // Route to get a product
router.post('/products', productController.create); // Route to create a new product
router.put('/products/:id', productController.update); // Route to update a product
router.delete('/products/:id', productController.delete); // Route to delete a product
router.get('/search', productController.search); // Route to search products
router.get('/category', productController.getByCategory); // Route to get products by category

module.exports = router;