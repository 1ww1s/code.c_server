const jwt = require('jsonwebtoken')
const { RefreshToken } = require('../models/models')
const Database = require('../error/DataBaseError')

class TokenService {
    async generateTokens(payloadForAccess, payloadForRefresh){
        const accessToken = jwt.sign(payloadForAccess, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payloadForRefresh, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveRefreshToken(userId, token){
        try {
            const dataToken = await RefreshToken.findOne({where: {userId}})
            if(dataToken) {  // Токен уже есть в системе
                dataToken.token = token
                return await dataToken.save()
            }
            const newToken = await RefreshToken.create({token, userId})
            return newToken
        }
        catch(e){
            throw e
        }
    }

    async getUser(token){
        const user = await RefreshToken.findOne({where: {token}})
        return user
    }

    async validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }
        catch(e){
            return null
        }
    }

    async validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }
        catch(e){
            return null
        }
    }

    async removeToken(token){
        await RefreshToken.destroy({where: {token}}).catch(e => {throw Database.Conflict('token не обнаружен')})
    }
}

module.exports = new TokenService()