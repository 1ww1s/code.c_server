const Router = require('express').Router
const userController = require('../controllers/UserController')
const authRouter = new Router()
const {body} = require('express-validator')
const AuthMiddleware = require('../middleware/AuthMiddleware')

authRouter.post('/registration', 
    body('email').isEmail().withMessage('Такого email не существует'),
    body('password').isLength({min:6, max:20}).withMessage('Пароль должен содержать от 6 до 20 символов')
    .matches(/[a-zA-Z]/).withMessage('В пароле должны быть буквы')
    .matches(/[0-9]/).withMessage('В пароле должны быть цифры'),
    userController.registration)
authRouter.post('/login', 
    body('email').isEmail().withMessage('Такого email не существует'),
    body('password').isLength({min:6, max:20}).withMessage('Пароль должен содержать от 6 до 20 символов'),
    userController.login)
authRouter.get('/logout', userController.logout)
authRouter.get('/activate/:link', userController.activate)
authRouter.get('/refresh', userController.refresh)
authRouter.get('/logout', AuthMiddleware, userController.logout)
authRouter.get('/check',  AuthMiddleware, userController.checkAuth)
authRouter.post('/reminder', userController.reminder)
authRouter.post('/recover', userController.recover)

module.exports = authRouter