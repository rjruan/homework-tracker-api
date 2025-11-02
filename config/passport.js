console.log('DEBUG: GOOGLE_CLIENT_ID=', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
console.log('DEBUG: OAuth callbackURL will be:', `${process.env.BASE_URL || 'http://localhost:8080'}/auth/google/callback`);
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:8080'}/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }
      user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value,
        lastLogin: new Date()
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const u = await User.findById(id);
    done(null, u);
  });
};