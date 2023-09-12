// Create Models
const User = require('../models/user');


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
        password = req.body.user_password;

        User.create({
            fullname: name,
            email: email,
            password: password
        })

        res.redirect('auth/login')
    } catch (error) {
        console.error(error);
    }
}