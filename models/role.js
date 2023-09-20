const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Role = sequelize.define("roles", {
    role_name:{
        type: DataTypes.STRING,
        allowNull: false,
    }, 
});

module.exports=Role;