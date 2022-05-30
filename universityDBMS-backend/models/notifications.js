'use strict';

const dbService = require('../services/database.js');
const q = require('q');

const createNotification = (receiver_id, conversation_id, sender_id) => {
    console.log('inside create notification model ', receiver_id, sender_id)
    let defer = q.defer()
    const sql = "SELECT User_Name FROM user WHERE ID = ?"
    const values = [
        sender_id
    ]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result in line 15 of notification model: ', result)
        if(result.success) {
            let sender_name = result.data[0].User_Name
            let notification = sender_name + ' has Sent You a New Message'
            const sql = "INSERT INTO notification(notification, receiver_id, sender_id, conversation_id) VALUES (?)"
            let values = [[
                notification,
                receiver_id,
                sender_id,
                conversation_id
            ]]
            dbService.executeQuerys(sql, values)
            .then((result)=>{
                console.log('result in line 19 of notification model: ', result)
                if(result.success) {
                    defer.resolve(result)
                }
            })
            .catch((err)=>{
                console.log('error is found',err)
                defer.resolve(err)
            })
        }
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    
    return defer.promise;
}

const getNotification = (user_id) => {
    let defer = q.defer()
    const sql = "SELECT * FROM notification WHERE receiver_id = ?"
    let values = [
        user_id
    ]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful: ', result)
        defer.resolve({
            success: true,
            data: result.data
        })
    })
    .catch((err)=>{
        console.log('error is found: ',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getCount = (user_id) => {
    let defer = q.defer()
    const sql = "SELECT COUNT(ID) AS notification_count FROM notification WHERE receiver_id = ? AND status = 'unread' "
    let values = [
        user_id
    ]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful: ', result)
        defer.resolve({
            success: true,
            data: result.data
        })
    })
    .catch((err)=>{
        console.log('error is found: ',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const updateNotificationStatus = (data, user_id) => {
    let defer = q.defer()
    const sql = "UPDATE notification SET status = ? WHERE ID = ?"
    let values = [
        data.status,
        data.notification_id
    ]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful: ', result)
        defer.resolve({
            success: true,
            data: result.data
        })
    })
    .catch((err)=>{
        console.log('error is found: ',err)
        defer.resolve(err)
    })
    return defer.promise;
}

module.exports = {
    createNotification,
    getNotification,
    updateNotificationStatus,
    getCount
}