const { Op } = require('sequelize')
const Database = require('../error/DataBaseError')
const { Article } = require('../models/models')
const fragmentService = require('./fragmentService')

class ArticleServie{

    async create(title, sectionId, index){
        const article = await Article.create({title, sectionId, index}).catch(e => {throw Database.Conflict('Статья с таким именем уже существует')})
        return article
    }

    async getAll(){
        const articles = await Article.findAll()
        return articles
    }

    async getLast(id){
        const articles = await Article.findAll({order: [['createdAt', 'DESC']],  where:{sectionId: {[Op.ne]: id}}, limit:5})
        return articles

    }

    async getAllBySection(sectionId){
        const articles = await Article.findAll({where:{sectionId}, order: ['index']})
        return articles
    }

    async getCount(sectionId){
        const ind = await Article.count({where:{sectionId}})
        return ind
    }

    async get(title){
        const article = await Article.findOne({where:{title}})
        return article
    }

    async remove(title){
        await Article.destroy({where:{title}})
    }

    async update(title, sectionId){
        await Article.update({sectionId}, {where:{title}})
    }

    async updateIndex(title, index){
        await Article.update({index}, {where:{title}})
    }
}

module.exports = new ArticleServie()