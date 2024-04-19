const { Fragment } = require("../models/models")



class FragmentService{

    async create(title, type, text, style, index, articleId){
        const fragment = await Fragment.create({title, type, text, style, index, articleId}) 
        return fragment
    }

    async remove(articleId){
        await Fragment.destroy({where:{articleId}})
    }

    async removeOne(index, articleId){
        await Fragment.destroy({where:{index, articleId}})
    }

    async getOne(articleId, index){
        return await Fragment.findOne({where: {index, articleId}})
    }

    async getAllData(articleId){
        const fragmentsData = await Fragment.findAll({
            where: {articleId},
            order: ['index'],
        })
        return fragmentsData
    }


    async getAllMas(articleId){
        const fragmentsData = await Fragment.findAll({
            where: {articleId},
            order: ['index'], 
        })
        const fragments = fragmentsData.map(fragment => {
            return {
                title: fragment.title,
                type: fragment.type,
                text: fragment.text,
                style: JSON.parse(fragment.style),
            }
        })
        return fragments 
    }

    async update(newData, id){
        await Fragment.update(newData, {where:{id}})
    }
}




module.exports = new FragmentService()