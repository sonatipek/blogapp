const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Category = sequelize.define("blog", {
    categoryid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false, 
        primaryKey: true
    },
    category_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports=Category;