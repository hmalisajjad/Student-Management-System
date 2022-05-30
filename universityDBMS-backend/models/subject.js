'use strict';

const dbService = require('../services/database.js');
const q = require('q');

const createSubject = (data) => {
    let defer = q.defer()
    const sql = 'INSERT INTO subject(Subject_name, teacher_id, class_id) VALUES (?) '
    let value = [[
        data.subject_name,
        data.teacher_id,
        data.class_id
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

const getSubject = (data) =>{
    let pass = data.password
    let defer = q.defer()
    console.log(' getSubject', data )
    const sql = 'SELECT ID, User_Name, Email, Password, First_Name, Last_Name,Roles FROM user WHERE Email= ?'
    let value = [[
        data.email
    ]]
    dbService.executeQuerys(sql , value)
    .then((result)=>{
        console.log('result successful',result)
        let res = result.data[0]
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getAssignedTeacherSubject= (data, user_id) =>{
    let defer = q.defer()
    console.log(' getSubject', data)
    const sql = 'SELECT ID, Subject_name, subject_status FROM subject WHERE teacher_id = ?'
    let value = [[
        parseInt(data.user_id)
    ]]
    dbService.executeQuerys(sql , value)
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

const getAllSubjects = (user_id)=>{
    let defer = q.defer()
    const sql = 'SELECT subject.ID, subject.Subject_name, subject.subject_status, user.User_Name, class.Class_name FROM subject LEFT JOIN user ON user.ID = subject.teacher_id AND user.Roles= "Teacher" LEFT JOIN class ON class.ID = subject.class_id'
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
const getSubjectOfClass = (data, user_id)=>{
    let defer = q.defer()
    const sql = 'SELECT Class_name FROM class WHERE ID = ?; SELECT subject.ID, subject.Subject_name, subject.subject_status, user.User_Name FROM subject LEFT JOIN user ON user.ID = subject.teacher_id WHERE subject.class_id = ? AND subject.subject_status="available"'
    let values = [
        [parseInt(data.class_id)],
        [parseInt(data.class_id)]
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

const updateSubject = (data) => {
    console.log('inside updateSubject model')
    let defer = q.defer()
    const sql = 'SELECT subject_status AS status FROM subject WHERE ID = ?; UPDATE subject SET Subject_name = ? WHERE ID =? AND subject_status != "archived" '
    let value = [
        parseInt(data.subject_id),
        data.subject_name,
        parseInt(data.subject_id)
    ];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        if(result.data[0][0].status == 'archived'){
            defer.resolve({
                success: true,
                data: 'Archived Subjects cannot updated'
            })
        }
        else{
            defer.resolve({
                success: true,
                data : 'Subject Updated'
            })
        }
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const archiveSubject = (data) =>{
    let defer = q.defer()
    const sql = 'SELECT ID FROM test WHERE subject_id = ?'
    let value = [[
        data.subject_id
    ]];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result inline 142',result)
        if(result.data.length > 0){
            const sql2 = 'UPDATE subject SET subject_status = "archived" WHERE ID = ? '
            let value2 = [
                data.subject_id
            ]
            dbService.executeQuerys(sql2, value2)
            .then((result2)=>{
                defer.resolve(result2)
            })
        }
        else{
            defer.resolve({
                success : true,
                msg: 1,
                data: 'Subjects with no test cannot be archived '
            })
        }        
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const removeSubject = (data) =>{
    let defer = q.defer()
    const sql = 'SELECT ID FROM test WHERE subject_id = ?'
    let value = [[
        data.subject_id
    ]];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result successful',result)
        if(result.data[0].length == 0){
            const sql2 = 'DELETE FROM subject WHERE ID = ? '
            let value2 = [[
                data.subject_id
            ]]
            dbService.executeQuerys(sql2, value2)
            .then((result2)=>{
                defer.resolve(result2)
            })
        }
        else if(result.data.length > 0){
            defer.resolve({
                success : true,
                data: 'Cannot remove subject with dependent test.'
            })
        }        
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getSubjectName= (data, user_id)=>{
    let defer = q.defer()
    const sql = 'SELECT Subject_name FROM subject WHERE ID = ? '
    let value = [
        parseInt(data.subject_id)
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
    return defer.promise;
}


module.exports = {
    createSubject,
    getSubject,
    getAllSubjects,
    updateSubject,
    archiveSubject,
    removeSubject,
    getAssignedTeacherSubject,
    getSubjectOfClass,
    getSubjectName
}