'use strict';

const jwtToken = require('../services/token')

const bcrypt = require('bcrypt')
const dbService = require('../services/database.js');
const q = require('q');

const updateUser = (data) => {
    let defer = q.defer()
    const saltRounds = 10
    bcrypt.hash(data.password, saltRounds)
    .then(hash => {
         data.password = hash
        const sql = 'UPDATE user SET User_Name = ?,Password = ?, First_Name = ?, Last_Name = ? WHERE ID = ?'
        let value = [
        data.username,
        data.password,
        data.firstname,
        data.lastname,
        data.user_id
        ];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result successful',result)
        defer.resolve(result)
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    })
    .catch((error1) => {
        console.log('password error', error1);
    })
    return defer.promise;
}

const getUser = (data) =>{
    
}

const deleteUser = (data)=>{
    let defer = q.defer()
    const sql = 'DELETE FROM user WHERE ID = ?; DELETE FROM student_test WHERE student_id = ?'
    let values = [
        data.id,
        data.id
    ]
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

const getTeacher = (data) => {
    let defer = q.defer()
    const sql = 'SELECT ID FROM subject WHERE teacher_id = ? AND subject_status = "available"'
    let values = [[data.id]]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful',result)
        if(result.data.length > 0){
            defer.resolve({
                success: true,
                msg: 1,
                data:'cannot removed teacher while they are assigned to any subject'
            })
        }
        else{
            deleteUser(data)
            .then((result)=>{
                console.log('result successful',result)
                defer.resolve(result)
            })
            .catch((err)=>{
                console.log('error is found in deleteUser adminmodel',err)
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

module.exports = {
    updateUser,
    getUser,
    deleteUser,
    getTeacher
}