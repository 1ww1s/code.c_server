const Router = require('express').Router

const AuthMiddleware = require('../middleware/AuthMiddleware')
const authRouter = require('./authRouter')
const userControllers = require('../controllers/UserController')
const userRouter = new Router()

userRouter.use('/auth', authRouter)
userRouter.post('/sendActivation', AuthMiddleware, userControllers.sendActivation)
userRouter.post('/userpic/update', AuthMiddleware, userControllers.updateUserpic)
userRouter.post('/selectedArticle/add', AuthMiddleware, userControllers.addSelectedArticle)
userRouter.post('/selectedArticle/remove', AuthMiddleware, userControllers.removeSelectedArticle)

module.exports = userRouter