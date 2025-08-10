const express = require('express');
const router = express.Router();

const checkoutController = require('../controllers/checkoutController');

router.get('/', checkoutController.get);
router.post('/', checkoutController.purchase);
router.get('/status/:eventId', checkoutController.getStatus);

module.exports = router;