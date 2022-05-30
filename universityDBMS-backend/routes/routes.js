const express = require('express');

const router = express.Router();

const userRouter = require('./user');
const classRouter = require('./class')
const adminRouter = require('./admin');
const subjectRouter = require('./subject');
const testRouter = require('./test');
const studentRouter = require('./student');
const teacherRouter = require('./teacher');
const messageRouter = require('./message')
const fileRouter = require('./file')
const notificationRouter = require('./notifications')

router.use('/user', userRouter);

router.use('/admin', adminRouter);

router.use('/class', classRouter);

router.use('/subject', subjectRouter);

router.use('/test', testRouter);

router.use('/student', studentRouter);

router.use('/teacher', teacherRouter);

router.use('/message', messageRouter);

router.use('/file', fileRouter)

router.use('/notification', notificationRouter)

module.exports = router;