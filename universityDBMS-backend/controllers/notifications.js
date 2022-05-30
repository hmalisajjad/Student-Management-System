const notificationsModel = require('../models/notifications')
const tokenuser = require('../services/token');

const create = (req, res) => {
    let userId = tokenuser.getUserId(req)
    console.log('inside create notification')
    notificationsModel.createNotification(req.body, userId)
    .then((result) =>{
        res.send(result)
    })
    .catch((err)=>{
        console.log('error found in create notification', err)
        res.send(err)
    })
}

const get = (req, res) => {
    let userId = tokenuser.getUserId(req)
    console.log('request query', req.query)
    if(req.query.getCount){
        notificationsModel.getCount(userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getUsersList', err)
            res.send(err)
        })
    }
    else{
        notificationsModel.getNotification(userId)
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
    console.log('inside update notification status')
    notificationsModel.updateNotificationStatus(req.body, userId)
    .then((result) =>{
        res.send(result)
    })
    .catch((err)=>{
        console.log('error found in create notification', err)
        res.send(err)
    })
}

module.exports = {
    create,
    get,
    update
}