const express = require('express');
const router = express.Router();

const receiptController = require('../controllers/receiptController');

router.get('/', receiptController.get);
router.post('/', receiptController.purchase);

module.exports = router;