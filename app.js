const express = require("express");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const mongoose = require("mongoose")
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt")
const { UserModel } = require('./database/models/user_model')

const app = express();

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    cookie: {
        expires: 600000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    }
    catch (error) {
        done(error)
    }
})

passport.use(new LocalStrategy({
        usernameField: "email"
    },
    async (email, password, done) => {
        const user = await UserModel.findOne({ email }).catch(done)

        if (!user || !user.verifyPasswordSync(password)) {
            return done(null, false)
        }

        return done(null, user)
    }
))

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SESSION_SECRET
  },
    async (jwt_payload, done) => {
        const user = await UserModel.findById(jwt_payload.sub).catch(done)

        if (!user) {
            return done(null, false)
        }

        return done(null, user)
    }
  )
);

app.use(passport.initialize())
app.use(passport.session())

app.use(morgan("combined"));

app.use(require("./routes"));

app.use(express.static("public"));

app.use(require("./middleware/error_handler_middleware"));

module.exports = app;