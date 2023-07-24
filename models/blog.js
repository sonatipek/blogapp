const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Blog = sequelize.define("blogs", {
    blogid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false, 
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    summary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isShownOnPage: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

async function syncSQL() {
    await Blog.sync({force: true})
    console.info("Blog table is added!")
}

syncSQL();

module.exports=Blog;