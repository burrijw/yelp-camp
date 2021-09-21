/* ----------------------------------------
SEC Imports
---------------------------------------- */

//ANC Node Modules
const express = require('express');
const router = express.Router();
const passport = require('passport');

//ANC Utilities / Middleware
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

//ANC Models
const User = require('../models/user');

// !SEC

/* ----------------------------------------
SEC ROUTES
---------------------------------------- */
//ANC New user registration form
router.get('/register', (req, res) => {
    res.render('auth/register');
});

//ANC Create a new user
router.post(
    '/register',
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const tempUser = new User({ username, email });
            const user = await User.register(tempUser, password);
            req.login(user, (err) => {
                if (err) return next(err);
                req.flash('success', 'Welcome to Campsite!');
                res.redirect('/campgrounds');
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('/auth/register');
        }
    })
);

//ANC Show the login form
router.get('/login', (req, res) => {
    res.render('auth/login');
});

//ANC Check login for valid credentials, redir to campgrounds on success
router.post('/login',
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }),
    (req, res) => {
        const redirectUrl = req.session.returnTo || '/campgrounds';
        req.flash('success', 'You have logged in successfully.');
        res.redirect(redirectUrl);
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully been signed out.');
    res.redirect('/campgrounds')
})

// !SEC

/* ----------------------------------------
SEC Exports
---------------------------------------- */

module.exports = router;

// !SEC
