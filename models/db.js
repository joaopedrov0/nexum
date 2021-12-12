const { Sequelize, DataTypes } = require('sequelize')


const sequelize = new Sequelize('nexumapp', 'nexumuser', 'nexumpass', {
    host: 'db4free.net',
    dialect: 'mysql',
})


const Logins = sequelize.define('logins', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
})

const Posts = sequelize.define('posts', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
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
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
})

sequelize.sync()

module.exports = {Sequelize, sequelize, Posts, Logins}
