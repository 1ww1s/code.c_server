const siteService = require('../service/siteService') 


class SiteControllers {   

    async getArticlesHome(_, res, next){
        try{
            const articles = await siteService.getArticlesHome()
            return res.json(articles)
        }
        catch(e){
            next(e)
        }
    }

    async getTitlesArticlesBySection(req, res, next){
        try {
            const {section} = req.params; 
            const articles = await siteService.getTitlesArticlesBySection(section)
            res.json(articles)
        }   
        catch(e){
            next(e)
        }
    }

    async getArticlesLast(_, res, next){
        try{
            const articles = await siteService.getArticlesLast()
            console.log(articles)
            res.json(articles)
        }   
        catch(e){
            next(e)
        }
    }

    async getArticle(req, res, next){
        try{
            const { title } = req.body;
            if(!title) return next(CreateError.BadRequest('Нет названия статьи'))     
            const article = await siteService.getArticle(title)
            res.json(article)
        }
        catch(e){
            next(e)
        }
    }

    async getSections(_, res, next){
        try {
            const sections = await siteService.getSections()
            console.log(sections)
            res.json(sections)
        }
        catch(e){
            next(e)
        }
    }
} 


module.exports = new SiteControllers()