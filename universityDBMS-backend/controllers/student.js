const studentModel = require('../models/student');
const tokenuser = require('../services/token');

const create = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('student controller', request);
    studentModel.createStudent(request.newdata)
    
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
    if(req.query.getSubjectStudent){
        //console.log('inside get all users')
        
        studentModel.getSubjectStudent(req.query)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getsubjecttest', err)
            res.send(err)
        })
    }
    else if(req.query.getAssignedSubject){
        studentModel.getAssignedSubjects(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
    }
    else if(req.query.getStudentTest){
        studentModel.getStudentTest(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
    }
    else if(req.query.getStudentsList){
        studentModel.getStudentsList(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
    }
    
}
const update = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('student controller', request);
    studentModel.assignStudentToClass(request.newdata)
    
    .then((result)=>{
        console.log('result successful',result)
        res.send(result)
    })
    .catch((err)=>{
        console.log('error is found',err)
        res.send(err)
    })

    
}


module.exports = {
    create, 
    get,
    update
};