const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const User = sequelize.define("users", {
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiration: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: true });

module.exports=User;