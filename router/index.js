const Router = require('express').Router

const AuthMiddleware = require('../middleware/AuthMiddleware')
const router = new Router()
const userRouter = require('./userRouter')
const adminRouter = require('./adminRouter')
const siteRouter = require('./siteRouter')


router.use('/user', userRouter)
router.use('/admin', AuthMiddleware, adminRouter)
router.use('/site', siteRouter)


module.exports = router