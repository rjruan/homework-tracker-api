const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || '/');
  });

router.get('/failure', (req, res) => res.status(401).json({ message: 'Auth failed' }));

router.get('/logout', (req, res, next) => {
  req.logout((err) => { if (err) return next(err); res.redirect(process.env.FRONTEND_URL || '/'); });
});

module.exports = router;
