const adminService = require("../service/adminService");
const RequestError = require('../error/RequestError');
const articleService = require("../service/articleService");
const fragmentService = require("../service/fragmentService");
const sectionService = require("../service/sectionService");
const e = require("express");


class AdminControllers {    

    async createArticle(req, res, next){
        try {
            const { _title: title, _section: section, _fragments: fragments } = req.body;
            if(title.length === 0 || section.length === 0 || fragments.length === 0){
                return next(RequestError.BadRequest('Одно из полей пустое'))
            }
            if(title.length > 255 || section.length > 255) {
                return next(RequestError.BadRequest('Одно из полей превышает допустимое количество символов'))
            }
            const article = await adminService.createArticle(title, section, fragments)
            
            res.json({message: `Статья "${article.title}" добавлена`})
        }
        catch(e){
            next(e)
        }
    }

    async updateArticle(req, res, next){
        try{
            const { _title: title, _section: section, _fragments: fragments } = req.body;
            if(title.length === 0 || section.length === 0 || fragments.length === 0){
                return next(RequestError.BadRequest('Одно из полей пустое'))
            }
            if(title.length > 255 || section.length > 255) {
                return next(RequestError.BadRequest('Одно из полей превышает допустимое количество символов'))
            }
            const article = await adminService.updateArticle(title, section, fragments)
            res.json({message: `Статья "${title}" успешно изменена`})
        }
        catch(e){
            next(e)
        }
    }

    async updateArticles(req, res, next){
        try{
            const {articles} = req.body;
            await adminService.updateArticles(articles)
            res.json({message:'Порядок успешно изменен'})
        }
        catch(e){
            next(e)
        }
    }
    async updateSection(req, res, next){
        try{
            const {sections} = req.body;
            await adminService.updateSection(sections)
            res.json({message:'Оновление секций успешно'})
        }
        catch(e){
            next(e)
        }
    }

    async createSection(req, res, next){
        try {
            const {name, value} = req.body;
            if(name.length === 0 || value.length === 0) return next(RequestError.BadRequest('Поля не могут быть пустыми'))
            const section = await adminService.createSection(name, value)
            res.json({message: `Раздел "${name}" добавлен`})
        }
        catch(e){
            next(e)
        }
    }

    async createRole(req, res, next){
        try {
            const {value} = req.body;
            if(value.length === 0) return next(RequestError.BadRequest('Поля не могут быть пустыми'))
            const role = await adminService.createRole(value)
            res.json({message: `Роль "${value}" добавлена`})
        }
        catch(e){
            next(e)
        }
    }

    async getRole(_, res, next){
        try {
            const roles = await adminService.getRole()
            res.json(roles)
        }
        catch(e){
            next(e)
        }
    }

    async getSectionsExceptHome(_, res, next){
        try {
            const sections = await adminService.getSectionsExceptHome()
            res.json(sections)
        }
        catch(e){
            next(e)
        }
    }

    async getUsers(req, res, next){
        try {
            const {email} = req.body;
            if(!email) res.json([]) 
            const users = await adminService.getUsers(email)
            res.json(users)
        }
        catch(e){
            next(e)
        }
    }

    async updateUserRole(req, res, next){
        try {
            const {user} = req.body;
            if(!user) return next(RequestError.BadRequest('Не указан пользователь'))
            await adminService.updateUserRole(user)
            res.json({message: `Роли для пользователя "${user.email}" изменены`})
        }
        catch(e){
            next(e)
        }
    }

    async getTitlesArticles(_, res, next){
        try {
            const articles = await adminService.getTitlesArticles()
            res.json(articles)
        }   
        catch(e){
            next(e)
        }
    }

    async getHomeTitlesArticles(_, res, next){
        try {
            const articles = await adminService.getHomeTitlesArticles()
            res.json(articles)
        }   
        catch(e){
            next(e)
        }
    }

    async getTitlesArticlesBySection(req, res, next){
        try {
            const {section} = req.params;
            const sectionData = await sectionService.getSection(section)
            const articles = await adminService.getTitlesArticlesBySection(sectionData.id)
            res.json(articles)
        }   
        catch(e){
            next(e)
        }
    }

    async removeArticle(req, res, next){
        try {
            const {title} = req.body;
            const article = await adminService.removeArticle(title)
            res.json({message: `Статья "${article.title}" удалена`})
        }
        catch(e){
            next(e)
        }
    }

    async getArticle(req, res, next){
        try{
            const { title } = req.body;
            if(!title) return next(CreateError.BadRequest('Нет названия статьи'))            
            const article = await adminService.getArticle(title)
            res.json(article)
        }
        catch(e){
            next(e)
        }
    }

} 

module.exports = new AdminControllers()