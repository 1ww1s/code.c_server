const Router = require('express').Router
const siteController = require('../controllers/SiteController')
const siteRouter = new Router()

siteRouter.get('/home/article/get', siteController.getArticlesHome)
siteRouter.get('/article/getTitles/:section', siteController.getTitlesArticlesBySection)
siteRouter.get('/section/get', siteController.getSections)
siteRouter.post('/article/get', siteController.getArticle)
siteRouter.get('/article/last/get', siteController.getArticlesLast)

module.exports = siteRouter