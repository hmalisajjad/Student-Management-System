const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacher');


router.post('/', teacherController.create);
router.get('/', teacherController.get);
//router.patch('/', teacherController.update);
//router.delete('/', teacherController.remove);

module.exports = router;