const userService = require('../service/userService')
const AuthError = require('../error/AuthError')
const RequestError = require('../error/RequestError')
const {validationResult} = require('express-validator')
const Database = require('../error/DataBaseError')

const cookieOptions = {
    maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
}

class UserControllers{ 
    async registration(req, res, next){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(AuthError.BadRequest(errors.array()[0].msg, errors.array()[0].path))
            }
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            res.cookie('token', userData.refreshToken, cookieOptions)
            return res.json({user: userData.user, accessToken: userData.accessToken})
        }
        catch(e) {
           next(e)
        }
    }

    async login(req, res, next){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(AuthError.BadRequest(errors.array()[0].msg, errors.array()[0].path))
            }
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('token', userData.refreshToken, cookieOptions)
            return res.json({user: userData.user, accessToken: userData.accessToken})
        }
        catch(e) {
            next(e)
        }
    }

    async logout(req, res, next){
        try {
            const refreshToken = req.cookies.token
            await userService.logout(refreshToken)
            res.clearCookie('token')
            return res.status(200).json({message:"logout"})
        }
        catch(e) {
            next(e)
        }
    }

    async sendActivation(req, res, next){
        try {
            const { email } = req.body;
            await userService.sendActivation(email)
            res.json({message:'Ссылка для подтверждения успешно отправлена, проверьте почту'})
        }
        catch(e){
            next(e)
        }
    }

    async updateUserpic(req, res, next){
        try {
            const {data} = req.body;
            const sizeBytes = parseInt((data).replace(/=/g,"").length * 0.75);
            const sizeMB  = sizeBytes / 1e6;
            if(sizeMB > 2) throw RequestError.BadRequest('*Максимальный размер изображения 2МБ')
            const user = req.user;
            const userData = await userService.get(user.email)
            if(!userData) throw Database.NotFound('Пользователь не найден')
            await userService.update({userpic: data}, userData.id)
            res.json(data)
        }
        catch(e){
            next(e)
        }
    }

    async getUserpic(req, res, next){
        try {
            const user = req.user;
            const userData = await userService.get(user.email)
            if(!userData) throw Database.NotFound('Пользователь не найден')
            res.json({userpic: userData.userpic})
        }
        catch(e){
            next(e)
        }
    }

    async addSelectedArticle(req, res, next){
        try{
            const {email, title} = req.body;
            if(!email || !title) throw RequestError.BadRequest('Одно из полей пустое')
            await userService.addSelectedArticle(email, title)
            res.sendStatus(200)
        }
        catch(e){
            next(e)
        }
    }

    async removeSelectedArticle(req, res, next){
        try{
            const {email, title} = req.body;
            if(!email || !title) throw RequestError.BadRequest('Одно из полей пустое')
            await userService.removeSelectedArticle(email, title)
            res.sendStatus(200)
        }
        catch(e){
            next(e)
        }
    }

    async activate(req, res, next){
        try {
            const {link} = req.params;
            await userService.activate(link)
            res.redirect(process.env.CLIENT_URL)
        }
        catch(e){
            next(e)
        }
    }

    async checkAuth(req, res, next){
        try{
            if(!req.user.email) throw RequestError.BadRequest('Не указан email')
            const user = await userService.checkAuth(req.user.email)
            return res.json(user)
        }
        catch(e){
            next(e)
        }
    }

    async reminder(req, res, next){
        try{
            const {email} = req.body;
            if(!email) throw RequestError.BadRequest('Не указан email')
            await userService.reminder(email)
            res.json({message:"Ссылка для восстановления пароля успешно отправлена на ваш email"})
        }   
        catch(e){
            next(e)
        }
    }

    async recover(req, res, next){
        try{
            const {link, password: newPassword} = req.body;
            if(!link || !newPassword) throw RequestError.BadRequest('Одно из полей пустое')
            await userService.recover(link, newPassword)
            res.json({message:"Пароль успешно изменен"})
        }   
        catch(e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try {
            const token = req.cookies.token
            const userData = await userService.refresh(token)
            res.cookie('token', userData.refreshToken, cookieOptions)
            return res.json({user: userData.user, accessToken: userData.accessToken})
        }
        catch(e){
            next(e)
        }
    }
}


module.exports = new UserControllers()