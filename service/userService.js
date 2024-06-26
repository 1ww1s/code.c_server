const { User, UserSelectedArticle, Article } = require("../models/models");
const AuthError = require('../error/AuthError');
const bcrypr = require('bcrypt');
const tokenService = require('./tokenService');
const articleService = require('./articleService');
const recoverLinkService = require('./RecoverLinkService');
const UserAccessDto = require("../dtos/userAccessDto");
const UserRefreshDto = require("../dtos/userRefreshDto");
const UserDto = require("../dtos/userDto");
const uuid = require('uuid')
const mailService = require('../service/mailService')
const { Op } = require('sequelize');
const Database = require("../error/DataBaseError");
const sectionService = require("./sectionService");
const RequestError = require("../error/RequestError");

class UserService{

    async createRes(user){
        const userAccessDto = new UserAccessDto(user)
        const userRefreshDto = new UserRefreshDto(user)
        const userClient = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userAccessDto}, {...userRefreshDto})
        await tokenService.saveRefreshToken(user.id, tokens.refreshToken)
        return {...tokens, user: userClient}
    }

    async registration(email, password){
        
        const candidate = await this.get(email)
        if(candidate){
            throw AuthError.UnprocessableEntity(`Пользователь ${email} уже зарегистрирован`)         
        }
        const hashPassword = bcrypr.hashSync(password, 5)
        const activationLink = uuid.v4()
        const user = await User.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/api/user/auth/activate/${activationLink}`)
        
        return this.createRes(user)
    }

    async login(email, password){
        const user = await this.get(email)
        if(!user) {
            throw AuthError.BadRequest(`Пользователь ${email} не зарегистрирован`)        
        } 
        const isPassEquals = bcrypr.compareSync(password, user.password)
        if(!isPassEquals) {
            throw AuthError.BadRequest(`Неверный пароль`)        
        }  
        return this.createRes(user)
    }

    async logout(refreshToken){
        if(!refreshToken) return
        await tokenService.removeToken(refreshToken)
    }
    
    async sendActivation(email){
        const userData = await User.findOne({where: {email}})
        if(!userData) throw Database.NotFound('Пользователь не найден')
        await mailService.sendActivationMail(userData.email, `${process.env.CLIENT_URL}/api/user/auth/activate/${userData.activationLink}`)
    }

    async activate(link){
        const userData = await User.findOne({where: {activationLink: link}})
        if(!userData) {
            throw AuthError.BadRequest('Неверная ссылка активации')
        }
        userData.isActivated = true
        return userData.save()
    }
    
    async reminder(email){
        const userData = await User.findOne({where: {email}})
        if(!userData) throw Database.NotFound('Пользователь не найден')
        const reminderLink = uuid.v4()
        await recoverLinkService.setLink(userData.id, reminderLink)
        await mailService.sendReminder(email, `${process.env.CLIENT_URL}/login/recover/${reminderLink}`)
    }

    async recover(link, newPassword){
        const recoverLinkData = await recoverLinkService.getLink(link)
        if(!recoverLinkData) throw Database.NotFound('Неправильная ссылка, убедитесь, что перешли по актуальной ссылке из письма на своем email')
        const userData = await User.findOne({where:{id:recoverLinkData.userId}})
        if(!userData) throw Database.NotFound('По данной ссылке пользователя не сущестует')
        await recoverLinkService.deleteLink(link)
        const isPassEquals = bcrypr.compareSync(newPassword, userData.password)
        if(isPassEquals) {
            throw RequestError.BadRequest(`Новый пароль совпадает со старым`)        
        }  
        const hashPassword = bcrypr.hashSync(newPassword, 5)
        userData.password = hashPassword;
        await userData.save()
    }

    async checkAuth(email){
        const userData = await this.get(email)
        if(!userData) throw Database.NotFound('Пользователь не найден')
        const user = new UserDto(userData)
        return user
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw AuthError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        if(!userData) {
            throw AuthError.UnauthorizedError()
        }
        const refreshData = await tokenService.getUser(refreshToken)
        if(!refreshData) {
            throw AuthError.UnauthorizedError()
        }
        const userId = refreshData.userId
        const user = await User.findOne({where: {id: userId}})
        return this.createRes(user)
    }

    async get(email){
        let user = await User.findOne({where:{email}, include: Article})
        if(!user) return null
        const articles = user.articles?.map(async article => {
            const section = await sectionService.getSection(null, article.sectionId)
            if(section){
                return {
                    title: article.title,
                    section: section.value
                }
            }
        })
        user.articles = await Promise.all(articles) 
        return user
    }

    async addSelectedArticle(email, title){
        const userData = await User.findOne({where:{email}})
        if(!userData) throw Database.NotFound('Пользователь не найден')
        const articleData = await articleService.get(title)
        if(!articleData) throw Database.NotFound('Статья не найдена')
        await userData.addArticle(articleData)
    }

    async removeSelectedArticle(email, title){
        const userData = await User.findOne({where:{email}})
        if(!userData) throw Database.NotFound('Пользователь не найден')
        const articles = await userData.getArticles()
        const article = articles.find(article => article.title === title)
        if(!article) throw Database.NotFound('Статья не найдена')
        await article.user_selected_article.destroy();
    }


    async getAll(email){
        let users;
        if(email) users = await User.findAll({            
            where:{email: {[Op.startsWith]: email}}
        }) 
        return users
    }

    async update(newData, id){
        return await User.update(newData, {where:{id}})
    }
}

module.exports = new UserService()