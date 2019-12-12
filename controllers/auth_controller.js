const { UserModel } = require('../database/models/user_model')

// Render the user registration form
async function registerNew(req, res) {
    res.render('auth/register')
}

// Create a new user
async function registerCreate(req, res) {
    const { email, password } = req.body

    const user = await UserModel.create({ email, password })
    req.session.user = user
    res.redirect("/dashboard")
}

async function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

async function loginNew(req, res) {
    res.render('pages/login')
}

async function loginCreate(req, res) {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user) {
        return res.render('pages/login', {
            error: "Invalid email or password"
        })
    }

    const valid = await user.verifyPassword(password)

    if (!valid) {
        return res.render("pages/login", {
          error: "Invalid email or password"
        });
    }

    req.session.user = user
    res.redirect('/dashboard')
}

module.exports = {
    registerNew,
    registerCreate,
    logout,
    loginNew,
    loginCreate
}