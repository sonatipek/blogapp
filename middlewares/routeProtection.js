module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
        return res.render('pages/errors/403')
    }

    next();
}