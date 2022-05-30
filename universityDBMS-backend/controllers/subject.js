const subjectModel = require('../models/subject');
const tokenuser = require('../services/token');
const classModel = require('../models/class');
const teacherModel = require('../models/teacher');
const studentModel = require('../models/student')

const create = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('subject controller', request);
    subjectModel.createSubject(request)
    
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
    if(Boolean(req.query.getAllSubjects)){
        //console.log('inside get all users')
       
        subjectModel.getAllSubjects(userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getAssignedTeacherSubject)){
        subjectModel.getAssignedTeacherSubject(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })                
    }
    else if(Boolean(req.query.getSubjectOfClass)){
        subjectModel.getSubjectOfClass(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getSubjectOf', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getSubjectInitials)){
        console.log('inside of Subjectsinitials line 60')
        classModel.getSubjectClass(userId)
        .then((result) =>{
            
            console.log('result of getSubjects line 62', result)
            if(result.success){
                teacherModel.getSubjectTeacher(userId)
                .then((result1) =>{
                    if(result1.success){
                        let finalResult = {
                            success: true,
                            classes: result.data,
                            teachers: result1.data
                        }
                        res.send(finalResult)
                    }
                })
                .catch((err1)=>{
                    console.log('error found in getSubjectOf', err1)
                    res.send(err1)
                })
            }
        })
        .catch((err)=>{
            console.log('error found in getSubjectOf', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getSubjectName)){
        subjectModel.getSubjectName(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getSubjectOf', err)
            res.send(err)
        })
    }
    
}
const update = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('inside updatesubject controller', request);
    if(req.body.updateSubject){
        subjectModel.updateSubject(request)
        .then((result)=>{
            console.log('result successful',result)
            res.send(result)
        })
        .catch((err)=>{
            console.log('error is found',err)
            res.send(err)
        })
    }
    else if(req.body.archiveSubject){
        subjectModel.archiveSubject(request)
        .then((result)=>{
            console.log('result successful',result)
            res.send(result)
        })
        .catch((err)=>{
            console.log('error is found',err)
            res.send(err)
        })
    }

    
}

const remove = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('subject controller', request);
    subjectModel.removeSubject(request)
    
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
    update,
    remove
};