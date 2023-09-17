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

        const emailToRegister = await User.findOne({where: {email: email}});
        if (emailToRegister) {
            req.session.message = "Bu email adresi ile kayıt olunmuş. Lütfen giriş yapın."
            return res.redirect('/auth/login');
        }

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
        const message = req.session.message;
        delete req.session.message;
        
        return res.render('auth/login', {returnUrl: req.query, message: message});
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
                message: "Böyle bir kullanıcı bulunamadı!",
                returnUrl: req.query
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
            const returnUrl = req.query.returnUrl || "/";
            
            return res.redirect(returnUrl);
        }else{
            res.render('auth/login', {message: "Parola hatalı!", returnUrl: req.query})
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