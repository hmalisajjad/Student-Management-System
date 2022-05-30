'use strict';

const dbService = require('../services/database.js');
const q = require('q');

const getAssignedSubjects = (data, user_id)=>{
    let defer = q.defer()
    const sql = 'SELECT subject.ID, subject.Subject_name, subject.subject_status, student_subject.average_grade FROM student_subject LEFT JOIN subject ON subject.ID = student_subject.subject_id WHERE student_subject.student_id = ?'
    let values = [
        [parseInt(data.user_id)]
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

const getSubjectStudent = (data)=>{
    let defer = q.defer()
    const sql = 'SELECT student.ID, student.Student_name, student.Grade, student_test.ID FROM student_test LEFT JOIN student ON student.ID = student_test.student_id WHERE student_test.test_id =? '
    let values = [[
        parseInt(data.test_id)
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
const getStudentTest = (data, user_id) =>{
    let defer = q.defer()
    console.log('data: ', data)
    const sql = 'SELECT Subject_name FROM subject WHERE ID = ?; SELECT test.ID, test.test_name, test.test_date, student_test.student_grades FROM test LEFT JOIN student_test ON student_test.test_id = test.ID WHERE test.subject_id = ? AND student_test.student_id = ?'
    let values = [
        [parseInt(data.subject_id)],
       [parseInt(data.subject_id)],
        [parseInt(data.student_id)]
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

const getSubjectsOfPrevClass = (classId) => {
    let defer = q.defer()

    const subjectSql = 'SELECT ID AS subject_id FROM subject WHERE class_id = ?'
    let subjectValue = [
        classId
    ]

    dbService.executeQuerys(subjectSql, subjectValue)
    .then((subjectResult) => {
        console.log('subject of previous class: ', subjectResult)
        defer.resolve(subjectResult.data)
    })
    .catch((err) => {
        defer.resolve(err)
    })
    return defer.promise
}

const deletePrevInsertNewClass = (studentClassId, class_id, student) => {
    let defer = q.defer()

    const sql1 = 'DELETE FROM student_class WHERE ID = ?; INSERT INTO student_class(class_id, student_id) VALUES(?);'
    let value1 = [[
        studentClassId],
        [class_id,
        student]
    ]

    dbService.executeQuerys(sql1, value1)
    .then((result) => {
        defer.resolve(result)
    })
    .catch((err) => {
        defer.resolve(err)
    })
    return defer.promise
}

const deletePrevSubject = (subject_id, student) => {
    let defer = q.defer()

    const prevSubjSql = "DELETE FROM student_subject WHERE subject_id = ? AND student_id = ?;"
    let value1 = [
        subject_id,
        student
    ]

    dbService.executeQuerys(prevSubjSql, value1)
    .then((result) => {
        defer.resolve(result)
    })
    .catch((err) => {
        defer.resolve(err)
    })
    return defer.promise
}

const assignStudentToClass = (data) => {
    let defer = q.defer()
    console.log('result of line 61 in student model', data.student_ids, data.class_id)
    const sql = 'SELECT student_class.ID AS student_class_id, class_id FROM student_class WHERE student_id = ?; SELECT ID AS subject_id FROM subject WHERE class_id = ? AND subject_status ="available"'
    
    data.student_ids.forEach((student) => {
        let value = [[
            student],
            [data.class_id
        ]];
        
        dbService.executeQuerys(sql, value)
        .then((result)=>{
            console.log('result of line 74 in student model', result.data)
            if(result && result.data && result.data[0] && result.data[0].length > 0 && result && result.data && result.data[1] && result.data[1].length > 0){
                let subject_ids = result.data[1]
                let studentClassId = result.data[0][0].student_class_id
                let prevClassId = result.data[0][0].class_id
                getSubjectsOfPrevClass(prevClassId)
                .then((subjectResult) => {
                    console.log('subject of previous class: ', subjectResult)
                    let prevSubjects = subjectResult
                    deletePrevInsertNewClass(studentClassId, data.class_id, student)
                    .then((result1)=>{
                        console.log('result successful',result1)
                        if(result1.success)
                        {
                            prevSubjects.forEach((subj) => {
                                deletePrevSubject(subj.subject_id, student)
                                .then((prevSubjResult) => {
                                    console.log('delete prev subject result: ', prevSubjResult)
                                    defer.resolve(prevSubjResult)
                                })
                                .catch((error) => {
                                    console.log('error in delete previous subject: ', error)
                                    defer.resolve(error)
                                })
                            })
                            subject_ids.forEach((subject) => {
                                const sql2 = 'INSERT INTO student_subject(subject_id, student_id) VALUES (?)'
                                let value2 = [
                                    [subject.subject_id,
                                    student]
                                ]
                                dbService.executeQuerys(sql2, value2)
                                .then((result2)=>{
                                    console.log('result successful',result2)
                                    defer.resolve(result2)
                                })
                                .catch((err2)=>{
                                    console.log('error is found',err2)
                                    defer.resolve(err2)
                                })
                            })
                        }
                    })
                    .catch((err1)=>{
                        console.log('error is found',err1)
                        defer.resolve(err1)
                    })
                })
                .catch((subjError) => {
                    defer.resolve(subjError)
                })
            }
            else if(result && result.data && result.data[0] && result.data[0].length < 1 && result && result.data && result.data[1] && result.data[1].length > 0){
                let subject_ids = result.data[1]
                const sql3 = 'INSERT INTO student_class(class_id, student_id) VALUES(?);'
                let value3 = [
                    [data.class_id,
                    student]
                ]
                dbService.executeQuerys(sql3, value3)
                .then((result3)=>{
                    console.log('result successful',result3)
                    if(result3.success) {
                        subject_ids.forEach((subject) => {
                            const sql4 = 'INSERT INTO student_subject(subject_id, student_id) VALUES (?)'
                            let value4 = [
                                [subject.subject_id,
                                student]
                            ]
                            dbService.executeQuerys(sql4, value4)
                            .then((result4)=>{
                                console.log('result successful',result4)
                                defer.resolve(result4)
                            })
                            .catch((err4)=>{
                                console.log('error is found',err4)
                                defer.resolve(err4)
                            })
                        })
                    }
                })
                .catch((err3)=>{
                    console.log('error is found',err3)
                    defer.resolve(err3)
                })
            }
            else {
                defer.resolve({
                    success: false,
                    data: 'No Subject Found of this Class. Please add Subjects to this Class Before Assigning Students'
                })
            }
        })
        .catch((err)=>{
            console.log('error is found',err)
            defer.resolve(err)
        })
    })
    return defer.promise;
}

const getStudentsList = (data, user_id)=>{
    let defer = q.defer()
    const sql = 'SELECT user.ID, user.User_Name FROM user WHERE user.Roles = "Student"; SELECT Class_name FROM class WHERE ID=? '
    let values = [[data.class_id]]
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

const getStudentOfClass = (data) =>{
    let defer = q.defer()
    const sql = 'SELECT user.ID, user.User_Name FROM student_class LEFT JOIN user ON user.ID = student_class.student_id WHERE student_class.class_id = ? AND user.Roles = "Student" ORDER BY user.User_Name;'
    let values = [[data.class_id]]
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
    getAssignedSubjects,
    getSubjectStudent,
    getStudentTest,
    assignStudentToClass,
    getStudentsList,
    getStudentOfClass
    
}