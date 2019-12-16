const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { UserModel } = require("./database/models/user_model");
const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3100/oauth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        if (profile.emails && profile.emails.length > 0) {
            const user = await UserModel.findOne({ email: profile.emails[0].value }).catch(done)

            if (!user) {
                return done(null, false)
            }

            return done(null, user)
        }

        return done(null, false)
    }
))

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      const user = await UserModel.findOne({ email }).catch(done);

      if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);

passport.use(
  new JwtStrategy(
    {
        jwtFromRequest: req => {
            let token = null
            
            if (req && req.cookies) {
                token = req.cookies['jwt']
            }

            return token
        },
      secretOrKey: process.env.SESSION_SECRET
    },
    async (jwt_payload, done) => {
      const user = await UserModel.findById(jwt_payload.sub).catch(done);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);

module.exports = passport

