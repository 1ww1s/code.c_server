const Router = require('express').Router

const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const adminRouter = new Router()
const adminController = require('../controllers/AdminController')

adminRouter.post('/article/create', adminController.createArticle)
adminRouter.get('/article/getTitles/:section', adminController.getTitlesArticlesBySection)
adminRouter.post('/article/remove', adminController.removeArticle)
adminRouter.post('/article/update', adminController.updateArticle)
adminRouter.post('/articles/update', adminController.updateArticles)
adminRouter.post('/article/get', adminController.getArticle)
adminRouter.get('/article/getTitles', adminController.getTitlesArticles)
adminRouter.get('/article/home/getTitles', adminController.getHomeTitlesArticles)


adminRouter.post('/role/create', CheckRoleMiddleware('admin'), adminController.createRole)
adminRouter.get('/role/get', adminController.getRole)


adminRouter.post('/section/create', CheckRoleMiddleware('admin'), adminController.createSection)
adminRouter.get('/section/get', adminController.getSectionsExceptHome)
adminRouter.post('/section/update', CheckRoleMiddleware('admin'), adminController.updateSection)


adminRouter.post('/user/get', CheckRoleMiddleware('admin'), adminController.getUsers)
adminRouter.post('/user/updateRole', CheckRoleMiddleware('admin'), adminController.updateUserRole)


module.exports = adminRouter