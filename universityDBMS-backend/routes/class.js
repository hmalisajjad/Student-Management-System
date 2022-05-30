 const express = require('express');
 const router = express.Router();

 const classController = require('../controllers/class');


 router.post('/', classController.create);
 router.get('/', classController.get);
 router.patch('/', classController.update);
 router.delete('/', classController.remove);

 module.exports = router;