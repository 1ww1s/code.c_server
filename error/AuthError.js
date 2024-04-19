module.exports = class AuthError extends Error {
    constructor(status, message, field){
        super()
        this.message = message
        this.status = status
        this.field = field
    }
    static BadRequest(message, field = '') {
        return new AuthError(400, message, field)
    }

    static UnauthorizedError(){
        return new AuthError(401, 'Пользователь не авторизован')
    }
    
    static forbidden(message){
        return new AuthError(403, message)
    }

    static UnprocessableEntity(message, field = ''){
        return new AuthError(422, message, field)
    }
}