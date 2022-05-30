const adminModel = require('../models/admin');
const tokenuser = require('../services/token');

const update = (req,res) =>{
    let userid = tokenuser.getUserId(req);
    let request = req.body;
    console.log('admin controller', request);
    if(req.body.delete_user){
        // console.log('inside delete user')
        // remove(req, res) 
        // .then((result)=>{
        //     console.log('result successful',result)
        //     res.send(result)
        // })
        // .catch((err)=>{
        //     console.log('error is found',err)
        //     res.send(err)
        // })
    }
    else{
        adminModel.updateUser(request)
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
    console.log('admin controller', request);
    if(request.role=='Teacher'){
        adminModel.getTeacher(request)
        .then((result)=>{
                console.log('result successful',result)
                res.send(result)
            })
            .catch((err)=>{
                console.log('error is found',err)
                res.send(err)
            })
    }
    else{
        console.log('inside deleteuser')
        adminModel.deleteUser(request)
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

const get = (req, res) =>{  
    console.log('request query', req.query)
    if(req.query.getUsers){
       
    }
    else{
        adminModel.getUser(req.query)
    .then((result) =>{
        res.send(result)
    })
    .catch((err)=>{
        console.log('error found in get', err)
        res.send(err)
    })
    }
    
}


module.exports = {
    update, 
    get,
    remove
    
};