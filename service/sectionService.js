const { Op } = require('sequelize')
const { Section } = require('../models/models')
const Database = require('../error/DataBaseError')

class SectionServie{

    async saveSection(name, value, index){
        try{
            const section = await Section.create({name, value, index}).catch(e => {throw Database.Conflict('Имя раздела и обозначение на сайте должны быть уникальными')})
            return section
        }
        catch(e){
            throw e
        }
    }

    async getCount(){
        const ind = await Section.count()
        return ind
    }

    async updateIndex(index, name){
        await Section.update({index}, {where: {name}})
    }

    async removeSection(name){
        await Section.destroy({where:{name}})
    }

    async getSection(value, id){
        let section;
        if(value) section = await Section.findOne({where: {value}})
        else section = await Section.findOne({where: {id}})
        return section
    }

    async getSections(){
        const sections = await Section.findAll({order: ['index']})
        return sections
    }

    async getSectionsExceptHome(){
        const sections = await Section.findAll({
            where:{value: {[Op.ne]: 'home'}},
            order: ['index']
        })
        return sections
    }

}

module.exports = new SectionServie()