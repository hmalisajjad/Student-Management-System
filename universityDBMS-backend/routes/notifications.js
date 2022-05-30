const express = require('express');
const router = express.Router();

const notificationsController = require('../controllers/notifications');


router.post('/', notificationsController.create);
router.get('/', notificationsController.get);
router.patch('/', notificationsController.update);

module.exports = router;