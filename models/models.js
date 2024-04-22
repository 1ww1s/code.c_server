const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique:true},
    password: {type: DataTypes.STRING},
    userpic: {type: DataTypes.TEXT},
    activationLink: {type: DataTypes.STRING, unique: true},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    role: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ['user']},
})

const UserSelectedArticle = sequelize.define('user_selected_article', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
})

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING, unique: true}
})

const RefreshToken = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    token: {type: DataTypes.STRING},
})

const Article = sequelize.define('article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique:true},
    index: {type: DataTypes.INTEGER},
})


const Fragment = sequelize.define('fragment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING, defaultValue: 'text'},
    title: {type: DataTypes.STRING},
    text: {type: DataTypes.TEXT},
    index: {type: DataTypes.INTEGER},
    style: {type: DataTypes.JSON}
})


const Section = sequelize.define('section', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    value: {type: DataTypes.STRING, unique: true},
    index: {type: DataTypes.INTEGER},
})


const RecoverLink = sequelize.define('recoverLink', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    link: {type: DataTypes.STRING, unique: true},
})


User.hasOne(RecoverLink)
RecoverLink.belongsTo(User)

User.hasMany(RefreshToken)
RefreshToken.belongsTo(User)

Section.hasMany(Article)
Article.belongsTo(Section)

Article.hasMany(Fragment)
Fragment.belongsTo(Article)

User.belongsToMany(Article, {through: UserSelectedArticle})
Article.belongsTo(User, {through: UserSelectedArticle})

module.exports = {
    User,
    Role,
    RefreshToken,
    Article,
    Fragment,
    Section,
    UserSelectedArticle,
    RecoverLink
}