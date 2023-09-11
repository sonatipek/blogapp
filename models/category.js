const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Category = sequelize.define("category", {
    // primary key will add by sequelize
    category_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
});

module.exports=Category;