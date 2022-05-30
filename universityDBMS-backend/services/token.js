const { request } = require('express');
const jwt = require('jsonwebtoken');
const secret = 'aj44jsf@#sd'

const generateJWT = (id, email, username) => {
    return jwt.sign({
        id: id,
        email: email,
        name: username
    },secret)

}

const getToken = (req) =>{
    let auth = ''
    if(req && req.headers && req.headers.authorization){
        auth = req.headers.authorization;
    }
    
    if(auth && auth.split(' ').length > 1 && auth.split(' ')[0].toLowerCase()==='bearer'){
        return auth.split(' ')[1]
    }
    return null;
}

const decodeToken = (req) => {
    const tokenString = getToken(req)
    if (tokenString){
        return jwt.decode(tokenString)
    }
}

const getUserId = (request) =>{
    const decodedToken = decodeToken(request)
    if(decodedToken){
        return decodedToken.id
    }

}

const getClassId = (request) =>{
    const decodedToken = decodeToken(request)
    if(decodedToken){
        return decodedToken.id
    }

}

module.exports = { 
    generateJWT,
    getToken,
    decodeToken,
    getUserId,
    getClassId
}