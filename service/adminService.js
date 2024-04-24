const sectionService = require("./sectionService")
const articleService = require('./articleService')
const fragmentService = require('./fragmentService')
const roleService = require('./roleService')
const userService = require('./userService')
const sanitizeHtmlService = require('./sanitizeHtmlService')
const Database = require("../error/DataBaseError")
const RequestError = require('../error/RequestError')
const UserDto = require("../dtos/userDto")


class AdminService{
    async createArticle(title, value, fragments){
        try{
            const section = await sectionService.getSection(value)
            if(!section) throw RequestError.NotFound('Такого раздела нет')
            const countArticles = await articleService.getCount(section.id)
            const article = await articleService.create(title, section.id, countArticles)
            await Promise.all(fragments.map(async (fragment, index) => {
                if(fragment._text.length > 1e8)  throw RequestError.BadRequest('Одно из полей превышает допустимое количество символов')
                if(fragment._text.length === 0 && fragment._title === 0)  throw RequestError.BadRequest('Фрагмент не может быть пустым')
                const cleanHtml = sanitizeHtmlService.getCleanHtml(fragment._text)
                await fragmentService.create(fragment._title, fragment._type, cleanHtml, JSON.stringify(fragment._style), index, article.id)
            }))
            return article
        }
        catch(e){
            console.log(e)
            throw e
        }
        
    }

    async updateArticle(title, value, newFragments){                              
        const section= await sectionService.getSection(value)
        if(!section) throw Database.NotFound('Такого раздела нет')
        const article = await articleService.get(title)
        if(!article) throw Database.NotFound('Такой статьи не обнаружено') 
        const oldFragments = await fragmentService.getAllData(article.id)
        
        await Promise.all(newFragments.map(async (fragment, ind) => {  // delete or update
            if(fragment._index  !== -1){
                oldFragments[fragment._index].isUpdate = true
                await fragmentService.update({index:ind, title:fragment._title, type:fragment._type, style:JSON.stringify(fragment._style), text:fragment._text}, oldFragments[fragment._index].id)
            }
            else{
                await fragmentService.create(fragment._title, fragment._type, fragment._text, JSON.stringify(fragment._style), ind, article.id)
            }
        }))
        await Promise.all(oldFragments.map(async (fragment, ind) => { // delete
            if(!fragment.isUpdate){
                await fragmentService.removeOne(ind, article.id)
            }
        }))
        await articleService.update(title, section.id)
        return article
    }

    async updateArticles(newArticles){
        await Promise.all(newArticles.map(async (article, index) => {
            await articleService.updateIndex(article, index)
        }))
    }

    async updateSection(newSections){
        const sections = await sectionService.getSections()
        await Promise.all(sections.map(async section => {
            if(!newSections.find(newSection => newSection === section.name)){
                const articles = await articleService.getAllBySection(section.id)
                await Promise.all(articles.map(async article => await articleService.remove(article.title)))
                await sectionService.removeSection(section.name)
            }
        }))
        await Promise.all(newSections.map(async (section, index) => {
            await sectionService.updateIndex(index, section)
        }))
    }

    async createSection(name, value){
        const index = await sectionService.getCount()
        const section = await sectionService.saveSection(name, value, index)
        return section
    }

    async createRole(value){
        const role = await roleService.create(value)
        return role
    }

    async getRole(){
        const roles = await roleService.getAll()
        return roles.filter(role => (role.value !== 'admin') && (role.value !== 'user')).map(role => role.value)
    }

    async getSectionsExceptHome(){
        const sectionsData = await sectionService.getSectionsExceptHome()
        const sections = sectionsData.map(section => {
            return{
                name: section.name,
                value: section.value
            }
        })
        return sections
    }

    async getTitlesArticles(){
        const sectionHome = await sectionService.getSection('home')
        const articlesData = await articleService.getAll()
        let articles = articlesData.filter(a => a.sectionId != sectionHome.id)
        articles = articles.map(a => a.title)
        return articles
    }

    async getHomeTitlesArticles(){
        const sectionHome = await sectionService.getSection('home')
        const articlesData = await articleService.getAllBySection(sectionHome.id)
        let articles = articlesData.map(a => a.title)
        return articles
    }

    async getUsers(email){
        const usersData = await userService.getAll(email)
        return usersData.map(user => {return {email: user.email, roles: user.role}})
    }

    async updateUserRole(user){
        if(!user.email) RequestError.BadRequest('Не указан email')
        const usersData = await userService.get(user.email)
        if(!usersData)  throw Database.NotFound('Такого пользователя нет')
        user.roles = user.roles.filter(role => (role !== 'user') && (role !== 'admin'))   
        let roleData = (await roleService.getAll()).filter(role => (role.value !== 'admin') && (role.value !== "user")).map(role => role.value)
        user.roles.map(role => { if(!roleData.includes(role)) throw RequestError.BadRequest('Одна из ролей не существует') })   
        let newRoles = usersData.role.filter(role => (role === 'user') || (role === 'admin'))   
        newRoles.push(...user.roles)
        await userService.update({role: newRoles}, usersData.id)
    }

    async getTitlesArticlesBySection(sectionId){
        const articlesData = await articleService.getAllBySection(sectionId)
        const articles = articlesData.map(a => a.title)
        return articles
    }

    async removeArticle(title){
        const article = await articleService.get(title)
        await fragmentService.remove(article.id)
        await articleService.remove(title)     
        return article
    }

    async getArticle(title){
        const articleData = await articleService.get(title)
        if(!articleData) throw Database.NotFound('Такой статьи не обнаружено') 
        const sectionData = await sectionService.getSection(null, articleData.sectionId)
        const fragments = await fragmentService.getAllMas(articleData.id)
        return {
            title,
            section: sectionData.value,
            fragments
        }
    }
}

module.exports = new AdminService()