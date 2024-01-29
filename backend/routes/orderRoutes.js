const express = require('express');
const OrderController = require('../controllers/orderController');
const router = express.Router();

router.get('/all', OrderController.getAllOrders);
router.post('', OrderController.addOrder);

module.exports = router;