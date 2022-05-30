'use strict';

const dbService = require('../services/database.js');
const q = require('q');
const testModel = require('./test')

const importFile = (path, test_id, subject_id, user_id, data) => {
    let defer = q.defer()
    const sql="UPDATE test SET batch_grades = ? WHERE ID = ? AND subject_id = ?"
    let values = [
        path,
        test_id,
        subject_id,
        user_id
    ]
    dbService.executeQuerys(sql, values)
    .then((result)=>{
        console.log('result successful',result)
        updateGrades(data, test_id, user_id, subject_id)
        .then((result1)=>{
            console.log('result in line 20',result1)
            defer.resolve(result1)
        })
        .catch((err1)=>{
            console.log('error in line 24 of file model',err1)
            defer.resolve(err1)
        })
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const exportFile = (user_id) => {
    let defer = q.defer()
    
    return defer.promise;
}

const getStudentTestGrades = (data) => {
    let defer = q.defer();
    const sql2 = "SELECT student_test.student_grades, test.ID FROM test LEFT JOIN student_test ON student_test.test_id = test.ID WHERE test.subject_id = ? AND student_test.student_id = ?;"
    let values2 = [
        data.subject_id,
        data.student_id
    ]

    dbService.executeQuerys(sql2, values2)
    .then((result2) => {
        console.log('result in line 52 of file model: ', result2)
        let gradesList = result2.data
        console.log('grades list in line 54 in file model: ', gradesList)
        testModel.updateAverageGrades(gradesList, data)
        .then((result3) => {
            defer.resolve(result3)
        })
        .catch((err2)=>{
            console.log('error in 60 of file model',err2)
            defer.resolve(err2)
        })
    })
    .catch((err1)=>{
        console.log('error in 65 of file model',err1)
        defer.resolve(err1)
    })
    return defer.promise;
}

const updateGrades = (data, testId, userId, subjectId) => {
    console.log('inside update grades: ', data, testId, subjectId)
    let defer = q.defer()
    
    const sql = "SELECT ID FROM student_test WHERE test_id = ? AND student_id = ?"
    data.forEach((user) => {
        console.log('grades: ', testId, user['Student Id'])
        let values = [
            testId,
            parseInt(user['Student Id'])
        ]
        dbService.executeQuerys(sql, values)
        .then((result)=>{
            console.log('result of line 84 in file model: ', result)
            let grades = ""
            if(user['Grades']) {grades = user['Grades']}
            else if (user['Average Grades']) {grades = user['Average Grades']}
            if(result.data.length > 0) {
                const sql1 = "UPDATE student_test SET student_grades = ? WHERE test_id = ? AND student_id = ?"
                let values1 = [
                    grades,
                    testId,
                    parseInt(user['Student Id'])
                ]
                dbService.executeQuerys(sql1, values1)
                .then((result1)=>{
                    console.log('result in line 53 of file model',result1)
                    let data = {
                        student_id: parseInt(user['Student Id']),
                        subject_id: subjectId
                    }
                    getStudentTestGrades(data)
                    .then((result2) => {
                        defer.resolve(result2)
                    })
                    .catch((err2) => {
                        defer.resolve(err2)
                    })
                })
                .catch((err1)=>{
                    console.log('error in 57 of file model',err1)
                    defer.resolve(err1)
                })
            }
            else {
                const sql5 = "INSERT INTO student_test (student_grades, test_id, student_id) VALUES (?)"
                let value5 = [[
                    grades,
                    testId,
                    parseInt(user['Student Id'])]
                ]
                dbService.executeQuerys(sql5, value5)
                .then((result1)=>{
                    console.log('result in line 121 of file model',result1)
                    let data = {
                        student_id: parseInt(user['Student Id']),
                        subject_id: subjectId
                    }
                    getStudentTestGrades(data)
                    .then((result2) => {
                        defer.resolve(result2)
                    })
                    .catch((err2) => {
                        defer.resolve(err2)
                    })
                })
                .catch((err1)=>{
                    console.log('error in 57 of file model',err1)
                    defer.resolve(err1)
                })
            }
        })
        .catch((error) => {
            console.log('error in line 114: ', error)
            defer.resolve(error)
        })
    })
    return defer.promise
}

module.exports = {
    importFile,
    exportFile,
    updateGrades
}