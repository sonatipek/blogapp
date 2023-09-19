// Create Models
const User = require('../models/user');

// Node Modules
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Custom Modules
const emailService = require('../helpers/nodemail');
const csurf = require('csurf');


// Register Controller
exports.getRegister = async (req, res) => {
    try {
        return res.render('auth/register', {
            csrfToken: req.csrfToken()
        });
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

        const newUser = await User.create({
            fullname: name,
            email: email,
            password: password
        });

        emailService.sendMail({
            from: process.env.MAIL_USERNAME,
            to: newUser.email,
            subject: "Kaydınız Başarılı!",
            html: "<h1>BlogApp ailesine hoşgeldiniz!</h1> <br><br> <p>Hesabınız başarılı bir şekilde oluşturuldu.</p>"
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
        
        return res.render('auth/login', {
            returnUrl: req.query,
            message: message, 
            csrfToken: req.csrfToken()
        });
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

// Reset Controller
exports.getReset = async (req, res) => {
    try {
        const message = req.session.message;
        delete req.session.message;
        
        return res.render('auth/reset-password', {
            message: message, 
            csrfToken: req.csrfToken()
        });

    } catch (error) {
        console.error(error);
    }
}
exports.postReset = async (req, res) => {
    const email = req.body.user_email;

    try {      
        const user = await User.findOne({where: {email: email}});
        if (!user) {
            req.session.message = "Girdiğiniz mail adresi ile uyumlu bir mail adresi kayıtlı değil!"
            return res.redirect('/auth/reset-password')
        }

        let token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration =  Date.now() + (1000 * 60 * 60); //1 hour
        await user.save();

        emailService.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "BlogApp Şifre Sıfırlama Talebi",
            html: `
                <h3>Blogapp üzerinden bir şifre sıfırlama talebinde bulundunuz!</h3>
                <p>Şifrenizi sıfırlamak için lütfen <a href="http://localhost:3000/auth/reset-password/${token}">tıklayınız</a></p>
                <p>Şifrenizi sıfırlamak için oluşturulan linkin 1 saat süre ile geçerli olduğunu lütfen unutmayın.</p>

                <p><small>Bu isteği siz yapmadıysanız bir işlem yapmak zorunda değilsiniz.</small></p>
            `
        });
        
        req.session.message = "İşlem Başarılı! Şifre sıfırlama talebiniz için lütfen emailinizi kontrol ediniz.";
        return res.redirect('/auth/login');

    } catch (error) {
        console.error(error);
    }
}

// Reset password with token
exports.getResetPasswordWithToken = async (req, res) => {
    try {
        res.render('auth/reset-password-token', {
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error(error);
    }
}
exports.postResetPasswordWithToken = async (req, res) => {
    const newPassword = req.body.user_password, newPasswordAgain = req.body.user_password_again;
    const token = req.params.token;
    const user = await User.findOne({where: {resetToken: token}});

    try {

    // Invalid Token
    if (!user) {
        req.session.message = "Geçersiz token! Lütfen tekrar şifre sıfırlama talebinde bulunun!";
        return res.redirect('/auth/login');
    }

    // Token Expired
    if (Date.now() > user.resetTokenExpiration) {
        user.resetToken = null;
        user.resetTokenExpiration = null;
        user.save();
        
        req.session.message = "Şifre sıfırlama talep süreniz dolmuş! Lütfen tekrar talepte buşunun.";
        return res.redirect('/auth/login');
    }

    // Passwords are not equal
    if (newPassword != newPasswordAgain) {
        req.session.message = "Girilen iki şifre eşit değil. Lütfen tekrar deneyin!";
        return res.redirect('/auth/login');
    }

    // Everythins is ok
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    user.save();


    req.session.message = "Şifreniz başarıyla değiştirildi. Yeni şifreniz ile giriş yapabilirsiniz."
    return res.redirect('/auth/login');

    } catch (err) {
        console.error(err);
    }
}