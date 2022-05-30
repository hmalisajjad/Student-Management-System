const testModel = require('../models/test');
const tokenuser = require('../services/token');

const create = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('test controller', request);
    testModel.createTest(request)
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
    if(Boolean(req.query.getSubjectTest)){
        //console.log('inside get all users')
        
        testModel.getSubjectTest(req.query)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getsubjecttest', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getTestStudent)){
        testModel.getTestStudent(req.query)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
        
    }
    else if(Boolean(req.query.getTestDetails)){
        testModel.getTestDetails(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getGradeData)) {
        testModel.getGradeData(req.query)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in get', err)
            res.send(err)
        })
    }
    else if(Boolean(req.query.getGradeDetails)) {
        testModel.getGradeDetails(req.query)
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
    console.log('test controller', request);
    if(req.body.updateTest){
        testModel.updateTest(request)
    
        .then((result)=>{
            console.log('result successful',result)
            res.send(result)
        })
        .catch((err)=>{
            console.log('error is found',err)
            res.send(err)
        })
    }
    else if(req.body.updateGrade){
        testModel.updateGrade(request)
        .then((result)=>{
            console.log('result successful',result)
            res.send(result)
        })
        .catch((err)=>{
            console.log('error is found',err)
            res.send(err)
        })
    }   
    else if(req.body.addNewGrade) {
        console.log('inside add new test')
        testModel.addNewGrade(request)
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
    console.log('test controller', request);
    testModel.removetest(request)
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