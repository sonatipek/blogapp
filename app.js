// Requirements
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');


// Variables
const PORT = 3000; 

// Create instance
const app = express()

// Middlewares
app.use('/libs', express.static(path.join(__dirname, 'node_modules'))); //you can give an alias for static folder if you want
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", 'ejs') // you can use any template engine
app.use(express.urlencoded({extended: true}))


// !Routes
app.use('/admin', adminRoutes); //you can set a default startup path
app.use(userRoutes);



// relations
const Category = require('./models/category');
const Blog = require('./models/blog');

// onte to many
Category.hasMany(Blog, {
    foreignKey:{
        allowNull: false,
        defaultValue: 1
    }
})
Blog.belongsTo(Category)


// sync
const sequelize = require('./data/db');
const dummyData = require('./data/dummy-data');
// IIFE
(async () => {
    await sequelize.sync({alter: true})
    await dummyData();
})();

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})