const fileModel = require('../models/file')
const tokenuser = require('../services/token');
const q = require('q');
var fs = require('fs');
var stringify = require('csv-stringify');


const uploadfileToLocalSystem = (req, user_id) => {
    const defer = q.defer();
    let path = `public/uploads/${req.subjectId}/${req.testId}`
    let full_path = `public/uploads/${req.subjectId}/${req.testId}/${req.file_name}`

    stringify(req.file_data, {
        header: true
    }, function (err, output) {
        if (err) throw err;
        fs.mkdir(path, { recursive: true }, (err1) => {
            if (err1) throw err1;
            fs.writeFileSync(path + `/${req.file_name}`, output)
            console.log('successfully done')
            defer.resolve({
                success: true,
                path: full_path
            })
        });
    })

    return defer.promise;
}

const create = (req, res) => {
    let userId = tokenuser.getUserId(req)
    console.log('inside import file')
    uploadfileToLocalSystem(req.body, userId)
    .then((result) => {
        if(result.success) {
            console.log('result in line 37 of file controller: ', result)
            fileModel.importFile(result.path, req.body.testId, req.body.subjectId, userId, req.body.file_data)
            .then((result1) =>{
                res.send(result1)
            })
            .catch((err1)=>{
                console.log('error found in import file to db', err1)
                res.send(err1)
            })
        }
    })
    .catch((err) => {
        console.log('error in 34: ', err)
        res.send(err)
    })
}

const get = (req,res) => {
    let userId = tokenuser.getUserId(req)
    console.log('request query', req.query, 'user id: ', userId)
    fileModel.getUsersList(req.query, userId)
        .then((result) =>{
            res.send(result)
        })
        .catch((err)=>{
            console.log('error found in getUsersList', err)
            res.send(err)
        })
}

module.exports = {
    create,
    get
}