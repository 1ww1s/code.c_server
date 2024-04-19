const AuthError = require("../error/AuthError")
const tokenService = require("../service/tokenService")

module.exports = async function(req, _, next){
    const authorization = req.headers.authorization
    if(!authorization) return next(AuthError.UnauthorizedError())
    const accessToken = authorization.split(' ')[1]
    if(!accessToken) return next(AuthError.UnauthorizedError())
    const userData = await tokenService.validateAccessToken(accessToken)
    if(!userData) return next(AuthError.UnauthorizedError())
    req.user = userData;
    next()
}