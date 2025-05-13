const Router = require('express').Router

const AuthMiddleware = require('../middleware/AuthMiddleware')
const router = new Router()
const userRouter = require('./userRouter')
const adminRouter = require('./adminRouter')
const siteRouter = require('./siteRouter')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')


router.use('/user', userRouter)
router.use('/admin', AuthMiddleware, CheckRoleMiddleware('admin, moderator'), adminRouter)
router.use('/site', siteRouter)


module.exports = router