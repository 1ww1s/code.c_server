const AuthError = require('../error/AuthError');

module.exports = function(roles){
    return async function(req, _, next){
        let userData = req.user;
        let thereIsAccess = false;
        userData.role.map(role => {
            if(roles.includes(role)) thereIsAccess = true
        })
        if(!thereIsAccess) return next(AuthError.forbidden('Нет прав'))
        next()
    }
}