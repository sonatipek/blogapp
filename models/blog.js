const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Blog = sequelize.define("blogs", {
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
    isShownOnPage: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
    // if the relationship is ensured, foreign key will be added by sequelize
});

async function syncSQL() {
    await Blog.sync({force: true})
    console.info("Blog table is added!")

    const count = await Blog.count()
    if (count === 0) {
        Blog.create({
            title: "Lorem",
            summary: "Lorem ipsum",
            description: "Lorem ipsum dolor sit amet",
            image: "1.jpg",
            isShownOnPage: 1,
            isActive: 1,
            categoryId: "1",
        })

        Blog.create({
            title: "Lorem 2",
            summary: "Lorem ipsum 2",
            description: "Lorem ipsum dolor sit amet 2",
            image: "2.jpg",
            isShownOnPage: 1,
            isActive: 1,
            categoryId: "2",
        })
        
    }
}

syncSQL();

module.exports=Blog;