// !----Requirements----!
// Express 
const express = require('express');
// Create expressinstance
const app = express();

// Cookie Parser & Sessions
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Routes Requirements
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Node Modules
const path = require('path');
const csurf = require('csurf');

// Custom Modules
const sequelize = require('./data/db');
const dummyData = require('./data/dummy-data');
const locals = require('./middlewares/locals');

// Template Engine
app.set("view engine", 'ejs'); // you can use any template engine

// Modals
const Category = require('./models/category');
const Blog = require('./models/blog');
const User = require('./models/user');
const Role = require('./models/role');

// Middlewares
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({
    secret: "helloWorld",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 //milisecond
    },
    store: new SequelizeStore({
        db: sequelize 
    })

}));

app.use(locals);
app.use(csurf());

app.use('/libs', express.static(path.join(__dirname, 'node_modules'))); //you can give an alias for static folder if you want
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/admin', adminRoutes); //you can set a default startup path
app.use('/auth', authRoutes); //you can set a default startup path
app.use(userRoutes);

// Variables
const PORT = 3000; 
// !----Requirements----!



// * Relations
// onte to many - Category & Blog Relations
Category.hasMany(Blog, {
    foreignKey:{
        allowNull: true,
        defaultValue: 1
    },
    onDelete: "RESTRICT", //bu kategoriye ait bir blog varsa ve Kategori silinirse bunu engelle.
    onUpdate: "RESTRICT" //bu kategoriye ait bir blog varsa ve Kategori silinirse bunu engelle.
    // onDelete: "CASCADE" //bu kategoriye ait bir blog varsa ve Categori silinirse, blog da silinir. default değerdir
    // onDelete: "SET NULL" //bu kategoriye ait bir blog varsa ve Categori silinirse, categorisi null olarak eklenir.  null değer içermesine izin verilmelidir
    // onUpdate: "CASCADE" //bu kategoriye ait bir blog varsa ve Kategori güncellenirse blog da güncellenir. default değerdir
})
Blog.belongsTo(Category)

// one to many - Blog & User Relations
Blog.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
});
User.hasMany(Blog);

// many to many - Role & User Relations
Role.belongsToMany(User, {through: "userRoles"});
User.belongsToMany(Role, {through: "userRoles"});

// IIFE - to data sync
(async () => {
    await sequelize.sync({alter: true})
    await dummyData();
})();



// *Server
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})