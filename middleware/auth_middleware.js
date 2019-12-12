function authRedirect(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect("/dashboard")
    }

    return next()
}

function authorise(req, res, next) {
    if (req.session.user) {
        return next()
    }

    return res.redirect('/login')
}

module.exports = {
    authRedirect,
    authorise
}
