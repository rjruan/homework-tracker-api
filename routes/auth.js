const express = require('express');
const passport = require('passport');
const router = express.Router();
const ensureAuth = require('../middleware/auth'); 

// --- Authentication routes ---

// Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.BASE_URL || '/');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {});
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
