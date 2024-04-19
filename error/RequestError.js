module.exports = class RequestError extends Error{
    constructor(status, message){
        super()
        this.message = message
        this.status = status
    }

    static BadRequest(message) {
        return new RequestError(400, message)
    }

    static NotFound(message){
        return new RequestError(404, message)
    }

    static UnprocessableEntity(message){
        return new RequestError(422, message)
    }

}

