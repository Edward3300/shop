const express = require('express');
const ProductController = require('../controllers/productController');
const router = express.Router();

router.get('/all', ProductController.getAll);
router.get('/:id', ProductController.getOne);

module.exports = router;
