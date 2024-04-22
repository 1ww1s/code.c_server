const { RecoverLink } = require("../models/models")


class RecoverLinkService{
    async setLink(userId, link){
        try {
            const linkData = await RecoverLink.findOne({where: {userId}})
            if(linkData) {  
                linkData.link = link;
                return await linkData.save()
            }
            const newLink = await RecoverLink.create({link, userId})
            return newLink
        }
        catch(e){
            throw e
        }
    }
    async getLink(link){
        const recoverLink = await RecoverLink.findOne({where:{link}})
        return recoverLink
    }
}


module.exports = new RecoverLinkService()