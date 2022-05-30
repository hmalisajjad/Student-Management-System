const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message');


router.post('/', messageController.create);
router.get('/', messageController.get);
router.patch('/', messageController.update);
// router.delete('/', messageController.remove);

module.exports = router;