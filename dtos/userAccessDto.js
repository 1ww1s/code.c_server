module.exports = class UserAccessDto{
    email
    role
    isActivated

    constructor(model){
        this.email = model.email
        this.role = model.role
        this.isActivated = model.isActivated
    }
}