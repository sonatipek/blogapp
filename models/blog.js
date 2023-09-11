const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Blog = sequelize.define("blogs", {
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    url:{
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

module.exports=Blog;