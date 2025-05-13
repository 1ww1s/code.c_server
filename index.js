require('dotenv').config()
const sequelize = require('./db')
const express = require('express')
const app = express()
const PORT = process.env.PORT_SERVER || 5000;
const router = require('./router/index')
const error = require('./middleware/errorMiddleware')
const cookieParser = require('cookie-parser')
const cors = require('cors') 

app.use(cors({
    credentials: true,
    maxAge: 24 * 60 * 60,  // 24h
    origin: process.env.CLIENT_URL
}))
app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use('/api', router)
app.use(error)

const start = async () => {
    await sequelize.authenticate();
    await sequelize.sync()
    app.listen(PORT, () => console.log(`server started on PORT = ${PORT}`))
}
start()


