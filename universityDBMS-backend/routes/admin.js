const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

//routes
//router.post('/', adminController.create);
router.get('/', adminController.get);
router.patch('/', adminController.update);
router.delete('/', adminController.remove);

module.exports = router;