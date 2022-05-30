const express = require('express');
const router = express.Router();

const testController = require('../controllers/test');

//routes
router.post('/', testController.create);
router.get('/', testController.get);
router.patch('/', testController.update);
router.delete('/', testController.remove);

module.exports = router;