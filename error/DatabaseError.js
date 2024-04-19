module.exports = class Database extends Error{
    constructor(status, message){
        super()
        this.message = message
        this.status = status
    }

    static NotFound(message){
        return new Database(404, message)
    }
    static Conflict(message){
        return new Database(409, message)
    }
}

