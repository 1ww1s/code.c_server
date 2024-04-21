module.exports = class DataBase extends Error{
    constructor(status, message){
        super()
        this.message = message
        this.status = status
    }

    static NotFound(message){
        return new DataBase(404, message)
    }
    static Conflict(message){
        return new DataBase(409, message)
    }
}