// Create Models
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Register Controller
exports.getRegister = async (req, res) => {
    try {
        return res.render('auth/register');
    } catch (error) {
        console.error(error)
    }
}

exports.postRegister = async (req, res) => {
    try {
        const name = req.body.user_name,
        email = req.body.user_email,
        password = await bcrypt.hash(req.body.user_password, 10);

        User.create({
            fullname: name,
            email: email,
            password: password
        }) 

        res.redirect('/auth/login')
    } catch (error) {
        console.error(error);
    }
}

// Login Controller
exports.getLogin = async (req, res) => {
    try {
        return res.render('auth/login');
    } catch (error) {
        console.error(error);
    }
}

exports.postLogin = async (req, res) => {
    const email = req.body.user_email,
    password = req.body.user_password;

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })

        // Email control
        if (!user) {
            return res.render('auth/login', {
                message: "Böyle bir kullanıcı bulunamadı!"
            });
        }
        // password control
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Cookie create
            // res.cookie('isAuth', 1)

            // Session create
            req.session.isAuth = true;
            req.session.fullname = user.fullname;
            
            return res.redirect('/');
        }else{
            res.render('auth/login', {message: "Parola hatalı!"})
        }

    } catch (error) {
        console.error(error);
    }
}

// Logout Controller
exports.getLogout = async (req, res) => {
    try {
        await req.session.destroy();

        return res.redirect('/');
    } catch (error) {
        console.error(error);
    }
}