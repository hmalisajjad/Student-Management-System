'use strict';

const dbService = require('../services/database.js');
const q = require('q');

const getSubjectTeacher = (user_id)=>{
    let defer = q.defer()
    const sql = 'SELECT ID, User_Name FROM user WHERE Roles = "Teacher" '
    let values = [[
        user_id
    ]]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful',result)
        defer.resolve(result)
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}
module.exports = {
    getSubjectTeacher
    
}