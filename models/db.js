const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('nexum', 'root', '4nf1tr14o', {
    host: 'localhost',
    dialect: 'mysql',
})



const Logins = sequelize.define('logins', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const Posts = sequelize.define('posts', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contentText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    creatorID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

sequelize.sync()

module.exports = {Sequelize, sequelize, Posts, Logins}