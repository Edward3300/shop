const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/info', UserController.infoProfile);
router.post('/update', UserController.updateProfile);

module.exports = router;
