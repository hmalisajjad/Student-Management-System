'use strict';

const dbService = require('../services/database.js');
const q = require('q');

const createTest = (testData)=>{
    let defer = q.defer()
    const sql = 'INSERT INTO test(test_name, subject_id, test_date, total_marks) VALUES(?) '
    let values = [[
        testData.test_name,
        testData.subject_id,
        testData.test_date,
        testData.total_marks
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

const getSubjectTest = (data)=>{
    let defer = q.defer()
    const sql = 'SELECT Subject_name FROM subject WHERE ID = ?; SELECT test.ID, test.test_name, test.test_date, subject.subject_name FROM test LEFT JOIN subject ON subject.ID= test.subject_id WHERE test.subject_id = ? '
    let values = [
        [parseInt(data.subject_id)],
        [parseInt(data.subject_id)]
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
    return defer.promise
}

const getTestDetails = (data, user_Id)=>{
    console.log('line 45 gettestDetal', data)
    let defer = q.defer()
    const sql = "SELECT test_name, test_date FROM test WHERE ID = ?"
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
    return defer.promise
}

const getTestStudent = (data) =>{
    console.log('line 64', data)
    let defer = q.defer()
    const sql = "SELECT user.ID, user.User_Name, student_test.student_grades FROM student_test LEFT JOIN user ON user.ID = student_test.student_id WHERE student_test.test_id = ? ORDER BY user.ID"
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
    return defer.promise

}

const updateTest = (data) => {
    let defer = q.defer()
        const sql = 'UPDATE test SET test_name=?, test_date = ? WHERE ID=?  '
        let value = [
        data.test_name,
        data.test_date,
        data.test_id
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
const updateGrade = (data) => {
    let defer = q.defer()
        const sql = 'UPDATE student_test SET student_grades = ? WHERE test_id =? AND student_id = ?;'
        let value = [
            data.grade,
            data.test_id,
            data.student_id
        ];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result in line 116 in test model',result)
        if(result.success) {
            const sql2 = "SELECT student_test.student_grades, test.ID FROM test LEFT JOIN student_test ON student_test.test_id = test.ID WHERE test.subject_id = ? AND student_test.student_id = ?;"
            let values2 = [
                data.subject_id,
                data.student_id
            ]

            dbService.executeQuerys(sql2, values2)
            .then((result2) => {
                console.log('result in line 124: ', result2)
                let gradesList = result2.data
                console.log('grades list in line 119 in test modal: ', gradesList)
                updateAverageGrades(gradesList, data)
                .then((result3) => {
                   defer.resolve(result3)
                })
                .catch((err2)=>{
                    console.log('error is found',err2)
                    defer.resolve(err2)
                })
            })
            .catch((err1)=>{
                console.log('error is found',err1)
                defer.resolve(err1)
            })
        }
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const updateAverageGrades = (data, arr) => {
    let defer = q.defer()
    let studentGradeTotal = 0
    let testCount = 0
    let averageGrade = 0
    data.forEach((element) => {
        let studentGrade = parseInt(element.student_grades)
        studentGradeTotal += studentGrade
        testCount++
    })
    averageGrade = studentGradeTotal / parseFloat(testCount)
    const sql = "UPDATE student_subject SET average_grade = ? WHERE student_id = ? AND subject_id = ?"
    let values=[
        averageGrade.toFixed(2),
        arr.student_id,
        arr.subject_id
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

const addNewGrade = (data) => {
    let defer = q.defer()
    const sql = 'SELECT ID AS grade_id FROM student_test WHERE test_id = ? AND student_id = ?'
    let value = [
        data.test_id,
        data.student_id
    ];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result in line 134 test model',result)
        if(result && result.data) {
            if(result.data.length > 0)
            {
                defer.resolve({
                    success: true,
                    data: 'Record Already Exists!'
                })
            }
            else {
                const sql2 = "INSERT INTO student_test(test_id, student_id, student_grades) VALUES (?)"
                let values2 = [[
                    data.test_id,
                    data.student_id,
                    data.grades]
                ]
                dbService.executeQuerys(sql2, values2)
                .then((result1)=>{
                    console.log('result successful',result1)
                    if(result1.success) {
                        const sql3 = "SELECT student_test.student_grades, test.ID FROM test LEFT JOIN student_test ON student_test.test_id = test.ID WHERE test.subject_id = ? AND student_test.student_id = ?;"
                        let values3 = [
                            data.subject_id,
                            data.student_id
                        ]
                        dbService.executeQuerys(sql3, values3)
                        .then((result3) => {
                            console.log('result in line 124: ', result3)
                            let gradesList = result3.data
                            console.log('grades list in line 215 in test modal: ', gradesList)
                            updateAverageGrades(gradesList, data)
                            .then((result4) => {
                            defer.resolve(result4)
                            })
                            .catch((err3)=>{
                                console.log('error is found',err3)
                                defer.resolve(err3)
                            })
                        })
                        .catch((error)=>{
                            console.log('error is found',error)
                            defer.resolve(error)
                        })
                    }
                })
                .catch((err1)=>{
                    console.log('error is found',err1)
                    defer.resolve(err1)
                })
                return defer.promise;
            }
        }
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const removetest = (data)=>{
    let defer = q.defer()
    const sql = 'DELETE FROM test WHERE ID = ?; DELETE FROM student_test WHERE test_id = ? '
    let values = [
        data.test_id,
        data.test_id

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

const getGradeData = (data) => {
    let defer = q.defer()
    const sql = 'SELECT user.User_Name, student_test.student_grades, test.test_name FROM student_test LEFT JOIN user ON user.ID = student_test.student_id LEFT JOIN test ON test.ID = student_test.test_id WHERE student_test.test_id = ? AND student_test.student_id =? AND user.Roles = "Student"'
    let values = [
        parseInt(data.test_id),
        parseInt(data.student_id)
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

const getGradeDetails = (data) => {
    let defer = q.defer()
    const sql = 'SELECT user.ID, user.User_Name, test.test_name, student_subject.subject_id FROM test LEFT JOIN student_subject ON student_subject.subject_id = test.subject_id LEFT JOIN user ON user.ID = student_subject.student_id AND user.Roles = "Student" WHERE test.ID = ?'
    let values = [
        parseInt(data.test_id)
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
    createTest,
    getSubjectTest,
    updateTest,
    updateGrade,
    addNewGrade,
    removetest,
    getTestDetails,
    getTestStudent,
    getGradeData,
    getGradeDetails,
    updateAverageGrades
}