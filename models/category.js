const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Category = sequelize.define("category", {
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
},{
    timestamps: false
});


async function syncSQL() {
    await Category.sync({force: true})
    console.info("Category table is added!")
}

syncSQL();

module.exports=Category;