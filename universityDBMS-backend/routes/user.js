const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

//routes
router.post('/', userController.create);
router.get('/', userController.get);
//router.patch('/', userController);

module.exports = router;