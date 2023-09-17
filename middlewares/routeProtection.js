module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
        return res.redirect('/auth/login?returnUrl='+ req.originalUrl)
    }

    next();
}