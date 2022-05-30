const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student');

//routes
router.post('/', studentController.create);
router.get('/', studentController.get);
router.patch('/', studentController.update);

module.exports = router;