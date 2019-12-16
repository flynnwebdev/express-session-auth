const express = require("express");
const passport = require("passport")
const router = express.Router();
const PageController = require('../controllers/page_controller')
const AuthController = require('../controllers/auth_controller')
const { authRedirect, authorise } = require('../middleware/auth_middleware')

router.get("/", PageController.index);

router.get('/register', authRedirect, AuthController.registerNew)

router.post('/register', AuthController.registerCreate)

router.get('/dashboard', passport.authenticate('jwt', {session: false}), PageController.dashboard)

router.get('/logout', AuthController.logout)

router.get('/login', authRedirect, AuthController.loginNew)

router.post('/login', passport.authenticate('local', {
    // successRedirect: "/dashboard",
    failureRedirect: "/login",
    session: false
}), AuthController.loginCreate)

// Login with Google
router.get('/oauth/google', passport.authenticate('google', {
    scope: [ 'profile', 'email' ]
}))

// Callback from Google
router.get('/oauth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), AuthController.loginCreate)

module.exports = router;
