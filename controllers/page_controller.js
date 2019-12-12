function index(req, res) {
    req.session.views = req.session.views + 1 || 1
    res.json(req.session.views)
}

function dashboard(req, res) {
    res.render('pages/dashboard', { email: req.session.user.email })
}

module.exports = {
    index,
    dashboard
}
