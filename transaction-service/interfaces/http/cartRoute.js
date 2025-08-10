const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');

router.get('/', cartController.get); // Route to get the cart
router.post('/add', cartController.add); // Route to add an item to the cart
router.delete('/delete/:productId', cartController.delete); // Route to delete an item from the cart
router.delete('/empty', cartController.empty); // Route to purchase items in the cart
router.get('/status/:eventId', cartController.getStatus);

module.exports = router;
