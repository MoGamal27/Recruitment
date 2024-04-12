require('dotenv').config()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/UserDB')

// Local authentication strategy
passport.use(User.createStrategy());



// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"

}, (accessToken, refreshToken, profile, done) => {

  // Check if user already exists in database
  User.findOne({ email: profile.emails[0].value }, (err, user) => {

    if (err) return done(err);
    if (user) {
      return done(null, user);
    } else {
      // Create new user
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
      });
      newUser.save(err => {
        if (err) return done(err);
        done(null, newUser);
      });
    }
  });
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


