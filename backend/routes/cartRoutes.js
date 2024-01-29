const express = require('express');
const CartController = require('../controllers/cartController');
const router = express.Router();

router.post('/add', CartController.addItem);
router.delete('/remove/:id', CartController.removeOneItems);
router.get('/all', CartController.getAllItems);

module.exports = router;
