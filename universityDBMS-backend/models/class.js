'use strict';

const dbService = require('../services/database.js');
const q = require('q');
const studentModel = require('./student')

const createClass = (data) => {
    let defer = q.defer()
    const sql = 'INSERT INTO class(Class_name) VALUES (?) '
    let value = [[
        data.classname
    ]];
    
    dbService.executeQuerys(sql, value)
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

const updateClass = (data) => {
    let defer = q.defer()
    const sql = 'UPDATE class SET Class_name = ? WHERE ID =?'
    let value = [
        data.class_name,
        data.class_id
    ];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result successful',result)
        studentModel.assignStudentToClass(data)
        .then((result1)=>{
            console.log('result successful',result1)
            defer.resolve(result1)
        })
        .catch((err1)=>{
            console.log('error is found',err1)
            defer.resolve(err1)
        })
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getClass = (data) =>{
    let pass = data.password
    let defer = q.defer()
    console.log(' getclass', data )
    const sql = 'SELECT ID, User_Name, Email, Password, First_Name, Last_Name,Roles FROM user WHERE Email= ?'
    let value = [[
        data.email
    ]]
    dbService.executeQuerys(sql , value)
    .then((result)=>{
        console.log('result successful',result)
        let res = result.data[0]
        let passwordHash = res.Password
        bcrypt.compare(data.password, passwordHash)
        .then((authenticated) =>{
            console.log('AUTHENTICATION: ', authenticated)
            if(authenticated){
                
                defer.resolve({
                    success: true, 
                    user: {
                        id: res.ID, 
                        username: res.User_Name,
                        email: res.Email,
                        firstname: res.First_Name,
                        lastname: res.Last_Name,
                        role: res.Roles,
                        token: jwtToken.generateJWT(res.ID,res.Email,res.User_Name)
                    }, 
                    validated: true                    
                })
            }
            else{
                defer.resolve({
                    success: false,
                    validated: false
                })
            }
        })
        .catch((error2) => {
            console.log('error in bcrypt compare: ', error2)
        })
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getSubjectStudent = (data)=>{
    let defer = q.defer()
    const sql = 'SELECT user.ID, user.First_Name, user.Last_Name, student_subject.average_grade FROM student_subject LEFT JOIN user ON user.ID = student_subject.student_id WHERE student_subject.subject_id =? ORDER BY user.ID'
    let values = [[
        data.subject_id
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

const getAllClasses = (user_id)=>{
    console.log('inside get all classes')
    let defer = q.defer()
    const sql = 'SELECT * FROM class'
    let values = [
        user_id
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
const getSubjectClass = (user_id) =>{
    let defer = q.defer()
    const sql = 'SELECT * FROM class'
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

const removeClass = (data) =>{
    let defer = q.defer()
    const sql = 'DELETE FROM class WHERE ID=?; DELETE FROM student_class WHERE class_id =?; UPDATE subject SET subject_status = "archived" WHERE class_id = ?'
    let values = [
        data.class_id,
        data.class_id,
        data.class_id
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



module.exports = {
    createClass,
    getClass,
    getAllClasses,
    getSubjectClass,
    removeClass,
    updateClass,
    getSubjectStudent
}