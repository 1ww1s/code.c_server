const Router = require('express').Router

const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const adminRouter = new Router()
const adminController = require('../controllers/AdminController')

adminRouter.post('/article/create', CheckRoleMiddleware('admin, moderator'), adminController.createArticle)
adminRouter.get('/article/getTitles/:section', CheckRoleMiddleware('admin, moderator'), adminController.getTitlesArticlesBySection)
adminRouter.post('/article/remove', CheckRoleMiddleware('admin, moderator'), adminController.removeArticle)
adminRouter.post('/article/update', CheckRoleMiddleware('admin, moderator'), adminController.updateArticle)
adminRouter.post('/articles/update', CheckRoleMiddleware('admin, moderator'), adminController.updateArticles)
adminRouter.post('/article/get', CheckRoleMiddleware('admin, moderator'), adminController.getArticle)
adminRouter.get('/article/getTitles', CheckRoleMiddleware('admin, moderator'), adminController.getTitlesArticles)
adminRouter.get('/article/home/getTitles', CheckRoleMiddleware('admin, moderator'), adminController.getHomeTitlesArticles)


adminRouter.post('/role/create', CheckRoleMiddleware('admin'), adminController.createRole)
adminRouter.get('/role/get', CheckRoleMiddleware('admin, moderator'), adminController.getRole)


adminRouter.post('/section/create', CheckRoleMiddleware('admin'), adminController.createSection)
adminRouter.get('/section/get', CheckRoleMiddleware('admin, moderator'), adminController.getSectionsExceptHome)
adminRouter.post('/section/update', CheckRoleMiddleware('admin'), adminController.updateSection)


adminRouter.post('/user/get', CheckRoleMiddleware('admin'), adminController.getUsers)
adminRouter.post('/user/updateRole', CheckRoleMiddleware('admin'), adminController.updateUserRole)


module.exports = adminRouter