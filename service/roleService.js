const Database = require("../error/DataBaseError")
const { Role } = require("../models/models")

class RoleService{
    async create(value){
        const role = await Role.create({value}).catch(e => {throw Database.Conflict('Такая роль уже есть')})
        return role
    }

    async get(value){
        const role = await Role.findOne({where:{value}})
        return role
    }

    async getAll(){
        const roles = await Role.findAll()
        return roles
    }
}

module.exports = new RoleService()