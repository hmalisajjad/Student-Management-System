'use strict';

const dbService = require('../services/database.js');
const q = require('q');

const createMessage = (data, user_id) => {
    console.log('inside create message model ', data)
    let defer = q.defer()
    let messageData = data.user_id
    let conversation_type = ""
    if(messageData.length > 1) {
        conversation_type = "broadcast"
    }
    else {
        conversation_type = "individual"
    }
    const sql = "SELECT conversation.ID AS conversation_id FROM conversation WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?)"

    messageData.forEach((item) => {
        let values = [
            item,
            data.sender_id,
            item,
            data.sender_id
        ]
        dbService.executeQuerys(sql, values)
        .then((result)=>{
            console.log('result in line 28 of message model: ', result)
            if(result.success) {
                if(result.data[0] && result.data[0].conversation_id) {
                    let c_id =  result.data[0].conversation_id
                    console.log('c id', c_id)
                    const sql2 = "INSERT INTO messages(conversation_id, message, user_id) VALUES(?)"
                    let values2 =[[
                        c_id,
                        data.message,
                        data.sender_id
                    ]]
                    dbService.executeQuerys(sql2, values2)
                    .then((result2)=>{
                        console.log('result in line 41 of message model: ', result2)
                        defer.resolve({
                            success: true,
                            receiver_id: item,
                            conversation_id: c_id
                        })
                    })
                    .catch((err2)=>{
                        console.log('error is found',err2)
                        defer.resolve(err2)
                    })
                }
                else {
                    const sql3 = "INSERT INTO conversation(sender_id, receiver_id, conversation_type) VALUES (?)"
                    let values3 = [
                        [data.sender_id,
                        item,
                        conversation_type]
                    ]
                    dbService.executeQuerys(sql3, values3)
                    .then((result3)=>{
                        console.log('result in line 57 of message model: ', result3)
                        if(result3.success) {
                            let conv_id = result3.data.insertId
                            const sql4 = "INSERT INTO messages (conversation_id, message, user_id) VALUES(?)"
                            let values4 = [
                               [
                                conv_id,
                                data.message,
                                data.sender_id]
                            ]
                            dbService.executeQuerys(sql4, values4)
                            .then((result4)=>{
                                console.log('result in line 70 of message model: ', result4)
                                defer.resolve({
                                    success: true,
                                    receiver_id: item,
                                    conversation_id: conv_id
                                })
                            })
                            .catch((err4)=>{
                                console.log('error is found: ',err4)
                                defer.resolve(err4)
                            })
                        }
                    })
                    .catch((err3)=>{
                        console.log('error is found',err3)
                        defer.resolve(err3)
                    })
                }
            }
        })
        .catch((err)=>{
            console.log('error is found',err)
            defer.resolve(err)
        })
    })
    
    return defer.promise;
}

const reply = (data, user_id) => {
    let defer = q.defer()
    const sql = "INSERT INTO messages (conversation_id, message, user_id) VALUES(?)"
    let values = [[
        data.conversation_id,
        data.message,
        user_id
    ]]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result in line 113 of message model: ', result)
        defer.resolve(defer.resolve({
            success: true,
            receiver_id: data.user_id,
            conversation_id: data.conversation_id
        }))
    })
    .catch((err)=>{
        console.log('error is found: ', err)
        defer.resolve(err)
    })
    return defer.promise
}

const getUsersList = (data, user_id) => {
    let defer = q.defer()
    const sql="SELECT user.ID, user.User_Name, user.Roles FROM student_subject LEFT JOIN subject ON subject.ID = ? LEFT JOIN user ON user.ID = student_subject.student_id OR user.ID = subject.teacher_id WHERE student_subject.subject_id = ? AND user.ID != ?"
    let values = [
        parseInt(data.subject_id),
        parseInt(data.subject_id),
        user_id
    ]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful',result)
        let receivedResult = result.data
        let parsedResult = {}
        receivedResult.forEach((item) => {
            if(!parsedResult[item.ID]) {
                parsedResult[item.ID] = {}
                parsedResult[item.ID] = item
            }
        })
        let finalResult = {
            success: true,
            data: Object.values(parsedResult)
        }
        defer.resolve(finalResult)
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const checkSevenDaysMessages = (user_id) => {
    let defer = q.defer()
    const sql = "DELETE FROM messages WHERE date < (NOW() - INTERVAL 7 DAY); DELETE FROM notification WHERE date < (NOW() - INTERVAL 7 DAY);"
    let values = [
        [user_id],
        [user_id]
    ]

    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful in deleting seven days older messages: ', result)
        defer.resolve({
            success: true,
            data: result
        })
    })
    .catch((err)=>{
        console.log('error is found: ',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getRecentMessages = (user_id) => {
    let defer = q.defer()
    const sql = "SET @num := 0, @type := '';SELECT  *, @num := if(@type = id, @num + 1, 1) as row_number, @type := id as dummy FROM (SELECT conversation.ID AS id, user.ID as user_id, user.User_Name, user.Roles, messages.date, messages.ID as message_id, messages.message, messages.status FROM conversation LEFT JOIN user ON (user.ID = conversation.receiver_id OR user.ID = conversation.sender_id) LEFT JOIN messages ON messages.conversation_id = conversation.ID WHERE (conversation.sender_id = ? OR conversation.receiver_id = ?) AND user.ID != ? ORDER BY id, date) as subtable ORDER BY id DESC, date DESC;"
    
    let values = [
        user_id,
        user_id,
        user_id
    ]

    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful in line 168 get recent messages: ', result)
        result.data = parseRecentMessagesData(result.data[1])
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

const parseRecentMessagesData = (tempData) => {
    let finalResult = []
    if(tempData.length > 0) {
        tempData.forEach((item) => {
            if(finalResult[item.id]) {
                if(finalResult[item.id].date < item.date) {
                    finalResult[item.id] = item
                }
            }
            else {
                finalResult[item.id] = {}
                finalResult[item.id] = item
            }
        })
        finalResult = Object.values(finalResult)
        return finalResult
    }
    else {
        return 'Empty List'
    }
}

const getMessages = (data, user_id) => {
    let defer = q.defer()
    const sql = "SELECT messages.*, CASE WHEN messages.user_id = ? THEN true ELSE false END as is_sender FROM messages WHERE conversation_id = ? ORDER BY date"
    let values = [
        user_id,
        parseInt(data.conv_id)
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

const updateMessageStatus = (data, user_id) => {
    let defer = q.defer()
    const sql = "UPDATE messages SET status = ? WHERE conversation_id = ?"
    let values = [
        data.status,
        data.id
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
    createMessage,
    reply,
    getUsersList,
    checkSevenDaysMessages,
    getRecentMessages,
    getMessages,
    updateMessageStatus
}