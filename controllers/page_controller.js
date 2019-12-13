function index(req, res) {
    // req.session.views = req.session.views + 1 || 1
    res.json(req.user)
}

function dashboard(req, res) {
    res.render('pages/dashboard', { email: req.user.email })
}

module.exports = {
    index,
    dashboard
}
