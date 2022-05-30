const express = require('express');
const router = express.Router();

const fileController = require('../controllers/file');


router.post('/', fileController.create);
router.get('/', fileController.get);
// router.patch('/', messageController.update);
// router.delete('/', messageController.remove);

module.exports = router;