const AuthError = require('../error/AuthError');
const userService = require('../service/userService');

module.exports = function(roles){
    return async function(req, _, next){
        let userData = req.user;
        const userRoles = (await userService.get(userData.email)).role
        let thereIsAccess = false;
        userRoles.map(role => {
            if(roles.includes(role)) thereIsAccess = true
        })
        if(!thereIsAccess) return next(AuthError.forbidden('Нет прав'))
        next()
    }
}