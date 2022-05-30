const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subject');


router.post('/', subjectController.create);
router.get('/', subjectController.get);
router.patch('/', subjectController.update);
router.delete('/', subjectController.remove);

module.exports = router;