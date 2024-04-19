const AuthError = require("../error/AuthError")
const RequestError = require("../error/RequestError")
const DataBaseError = require("../error/DataBaseError")

module.exports = function(err, req, res, next){
    if(err instanceof AuthError) {
        return res.status(err.status).json({message: err.message, field: err.field})
    }
    if(err instanceof RequestError) {
        console.log(err.message)
        return res.status(err.status).json({message: err.message})
    }
    if(err instanceof DataBaseError) {
        console.log(err.message)
        return res.status(err.status).json({message: err.message})
    }
    console.log(e)
    return res.status(500).json({message: 'Непредвиденная ошибка'})
}