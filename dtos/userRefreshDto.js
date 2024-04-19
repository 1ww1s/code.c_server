module.exports = class UserRefreshDto{
    email

    constructor(model){
        this.email = model.email
    }
}