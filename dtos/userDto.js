module.exports = class UserDto{
    email
    role
    isActivated
    userpic
    selectedArticles

    constructor(model){
        this.email = model.email
        this.userpic = model.userpic
        this.role = model.role
        this.isActivated = model.isActivated
        this.selectedArticles = model.articles
    }
}