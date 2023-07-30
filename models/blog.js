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
    await Blog.sync({alter: true})
    console.info("Blog table is added!")

    const count = await Blog.count()
    if (count === 0) {
        Blog.create({
            title: "Lorem",
            summary: "Lorem ipsum",
            description: "Lorem ipsum dolor sit amet",
            image: "1.jpg",
            categoryid: "1",
            isShownOnPage: 1,
            isActive: 1
        })

        Blog.create({
            title: "Lorem 2",
            summary: "Lorem ipsum 2",
            description: "Lorem ipsum dolor sit amet 2",
            image: "2.jpg",
            categoryid: "2",
            isShownOnPage: 1,
            isActive: 1
        })
        
    }
}

syncSQL();

module.exports=Blog;