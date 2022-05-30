const messageModel = require('../models/message')
const tokenuser = require('../services/token');
const notificationModel = require('../models/notifications')

const create = (req, res) => {
    let userId = tokenuser.getUserId(req)
    console.log(' inside create message')
    if(req.body.replyMessage) {
        messageModel.reply(req.body, userId)
        .then((result) => {
            if(result.success)
            {
                notificationModel.createNotification(result.receiver_id, result.conversation_id, userId)
                .then((result1) =>{
                    res.send(result1)
                })
                .catch((err1)=>{
                    console.log('error found in create notification', err1)
                    res.send(err1)
                })
            }
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    }
    else {
        messageModel.createMessage(req.body, userId)
        .then((result) => {
            if(result.success)
            {
                notificationModel.createNotification(result.receiver_id, result.conversation_id, userId)
                .then((result1) =>{
                    res.send(result1)
                })
                .catch((err1)=>{
                    console.log('error found in create notification', err1)
                    res.send(err1)
                })
            }
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    }
}

const get = (req,res) => {
    let userId = tokenuser.getUserId(req)
    console.log('request query', req.query, 'user id: ', userId)
    if(Boolean(req.query.getUsersList)){
        messageModel.getUsersList(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getUsersList', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getRecentMessages)) {
        console.log('inside get recent messages')
        messageModel.checkSevenDaysMessages(userId)
        .then((result) =>{
            if(result.success) {
                messageModel.getRecentMessages(userId)
                .then((result1) =>{
                    res.send(result1)
                })
                .catch((err1)=>{
                    console.log('error found in getUsersList', err1)
                    res.send(err1)
                })
            }
        })
        .catch((err)=>{
            console.log('error found in getUsersList', err)
            res.send(err)
        })
        
    }
    else if(Boolean(req.query.getSelectedConv)) {
        console.log('inside get selected messages')
        messageModel.getMessages(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getUsersList', err)
            res.send(err)
        })
    }
}

const update = (req, res) => {
    let userId = tokenuser.getUserId(req)
    console.log('inside update message')
    messageModel.updateMessageStatus(req.body, userId)
    .then((result) => {
        res.send(result)
    })
    .catch((err)=>{
        console.log('error found in getAllClasses', err)
        res.send(err)
    })
}

module.exports = {
    create,
    get,
    update
}