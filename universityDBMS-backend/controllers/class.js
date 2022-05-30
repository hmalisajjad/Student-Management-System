const subjectModel = require('../models/subject');
const studentModel = require('../models/student');
const tokenuser = require('../services/token');
const classModel = require('../models/class')

const create = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('class controller', request);
    classModel.createClass(request)
    
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
    console.log('userid', userId)
    console.log('request query', req.query)
    if(Boolean(req.query.getAllClasses)){
        //console.log('inside get all users')
       console.log('user id:', userId)
        classModel.getAllClasses(userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    }
    
    else if(req.query.getClassForSubject ){
        classModel.getSubjectClass(userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    
    }
    else if(req.query.getClassDetail){
        console.log('inside getClasDetail')
        subjectModel.getSubjectOfClass(req.query,userId)
        .then((result) =>{
            console.log('result in line 55', result)
            if(result.success){
                studentModel.getStudentOfClass(req.query)
                .then((result1) =>{
                    console.log('result in line 60', result1)
                    if(result1.success){
                        let finalResult = {
                            success: true,
                            class_name: result.data[0][0].Class_name,
                            subjects: result.data[1],
                            students: result1.data
                        }
                        res.send(finalResult)
                    }
                })
                .catch((err1)=>{
                    console.log('error found in getAllClasses', err1)
                    res.send(err1)
                })
            }
            
        })
        .catch((err)=>{
            console.log('error found in getAllClasses', err)
            res.send(err)
        })
    }
    
}
const update = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('class controller', request);
    classModel.updateClass(request)
    
    .then((result)=>{
        console.log('result successful',result)
        res.send(result)
    })
    .catch((err)=>{
        console.log('error is found',err)
        res.send(err)
    })

    
}

const remove = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('class controller', request);
    classModel.removeClass(request)
    
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