const mysql = require('mysql2');
const config = require('./config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST
});

async function connect() {
    try {
        await sequelize.authenticate();
        console.log("MySQL bağlantısı başarılı");
    } catch (err) {
        console.error(`MySQL bağlantısında hata! Hata:${err}`)
    }
}

connect();

module.exports=sequelize;