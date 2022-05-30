'use strict';

const jwtToken = require('../services/token')

const bcrypt = require('bcrypt')
const dbService = require('../services/database.js');
const q = require('q');

const createUser = (data) => {
    let defer = q.defer()
    const saltRounds = 10
    bcrypt.hash(data.password, saltRounds)
    .then(hash => {
        data.password = hash
        const sql = 'INSERT INTO user(User_Name, Email, Password, First_Name, Last_Name, Roles) VALUES (?) '
        let value = [[
        data.username,
        data.email, 
        data.password,
        data.firstname,
        data.lastname,
        data.role
        ]];
    
    dbService.executeQuerys(sql, value)
    .then((result)=>{
        console.log('result successful',result)
        defer.resolve(result)
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    })
    .catch((error1) => {
        console.log('password error', error1);
    })
    return defer.promise;
}

const getUser = (data) =>{
    let pass = data.password
    let defer = q.defer()
    console.log(' getuser', data )
    const sql = 'SELECT ID, User_Name, Email, Password, First_Name, Last_Name,Roles FROM user WHERE Email= ?'
    let value = [[
        data.email
    ]]
    dbService.executeQuerys(sql , value)
    .then((result)=>{
        console.log('result successful',result)
        let res = result.data[0]
        let passwordHash = res.Password
        bcrypt.compare(data.password, passwordHash)
        .then((authenticated) =>{
            if(authenticated){
                
                defer.resolve({
                    success: true, 
                    user: {
                        id: res.ID, 
                        username: res.User_Name,
                        email: res.Email,
                        firstname: res.First_Name,
                        lastname: res.Last_Name,
                        role: res.Roles,
                        token: jwtToken.generateJWT(res.ID,res.Email,res.User_Name)
                    }, 
                    validated: true                    
                })
            }
            else{
                defer.resolve({
                    success: false,
                    validated: false
                })
            }
        })
        .catch((error2) => {
            console.log('error in bcrypt compare: ', error2)
        })
    })
    .catch((err)=>{
        console.log('error is found',err)
        defer.resolve(err)
    })
    return defer.promise;
}

const getUserData = (data)=>{
    let defer = q.defer()
    const sql = 'SELECT User_Name, Password, First_Name, Last_Name FROM user WHERE ID =?'
    let values = [[
        data.user_id
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

const getAllUsers = (user_id)=>{
    let defer = q.defer()
    console.log('inside get all users model')
    const sql = 'SELECT * FROM user WHERE Roles != "Admin"'
    let values = [[
        user_id
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
module.exports = {
    createUser,
    getUser,
    getAllUsers,
    getUserData
}