const teacherModel = require('../models/class');
const tokenuser = require('../services/token');
const testModel = require('../models/test');

const create = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('teacher controller', request);
    teacherModel.createteacher(request.newdata)
    
    .then((result)=>{
        console.log('result successful',result)
        res.send(result)
    })
    .catch((err)=>{
        console.log('error is found',err)
        res.send(err)
    })

    
}

const get = (req, res) =>{ 
    let userId = tokenuser.getUserId(req) 
    console.log('request query', req.query)
    if(req.query.getTeacher == 'true'){
        //console.log('inside get all users')
        
        teacherModel.getAllTeacher(userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    }
    else if(req.query.getTeacherForSubject == 'true'){
        teacherModel.getSubjectTeacher(userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
        
    }
    else if(req.query.getSubjectTest == 'true'){
        console.log('inside line 50')
        testModel.getSubjectTest(req.query)
        .then((result) =>{
            console.log("result in line 53", result)
            teacherModel.getSubjectStudent(req.query)
            .then((result1) =>{
                console.log('result of line 54',result1)
                if(result.success && result1.success){
                    res.send({
                        success: true,
                        subject_name: result.data[0][0].Subject_name,
                        tests: result.data[1],
                        students: result1.data
                    })
                }
            })
            .catch((err1)=>{
                console.log('error found in get', err1)
                res.send(err1)
            })
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
    }
    
}


module.exports = {
    create, 
    get
};