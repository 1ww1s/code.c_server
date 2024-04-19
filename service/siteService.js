const sectionService = require("./sectionService")
const articleService = require('./articleService')
const fragmentService = require('./fragmentService')
const Database = require("../error/DataBaseError")

class SiteService{

    async getArticlesHome(){
        const sectionData = await sectionService.getSection('home')
        if(!sectionData) throw Database.NotFound('Такого раздела нет') 
        const articlesData = await articleService.getAllBySection(sectionData.id)
        const articlesPromise = articlesData.map(async (articleData) => {
            let fragments = await fragmentService.getAllData(articleData.id)
            return {
                title: articleData.title,
                fragments: fragments.map(fragment => {
                    return{
                        title: fragment.title,
                        text: fragment.text,
                        type: fragment.type,
                        style: JSON.parse(fragment.style),
                    }
                })
            }
        })

        const articles = await Promise.all(articlesPromise)
        return articles
    }

    async getTitlesArticlesBySection(value){
        const sectionData = await sectionService.getSection(value)
        if(!sectionData) throw Database.NotFound('Такого раздела нет') 
        const articlesData = await articleService.getAllBySection(sectionData.id)
        let articles = articlesData.map(a => a.title)
        return articles
    }

    async getSections(){
        try {
            const sectionsData = await sectionService.getSections()
            const sections = sectionsData.map(s => { return {value: s.value, name: s.name} })
            return sections
        }
        catch(e){
            next(e)
        }
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


    async getArticlesLast(){
        const sectionHome = await sectionService.getSection('home')
        if(!sectionHome) throw Database.NotFound('Нет домашней страницы')
        const articlesData = await articleService.getLast(sectionHome.id)
        const articlePromises = articlesData.map(async article => {
            const sectionData = await sectionService.getSection(null, article.sectionId); 
            return {section: sectionData.value, title: article.title}
        })
        const articles = Promise.all(articlePromises)
        return articles
    }
} 

module.exports = new SiteService()