/* ----------------------------------------
SEC Imports
---------------------------------------- */

//ANC Node Modules
const express = require('express');
const router = express.Router();
const passport = require('passport');

//ANC Utilities / Middleware
const catchAsync = require('../utils/catchAsync');

//ANC Controller
const user = require('../controllers/userController')

// !SEC

/* ----------------------------------------
SEC ROUTES
---------------------------------------- */

router.route('/register')
    .get(user.renderNewUserForm)
    .post(catchAsync(user.createUser))

router.route('/login')
    .get(user.renderLoginForm)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }),
        user.login
    )

router.route('/logout')
    .get(user.logout)

// !SEC

/* ----------------------------------------
SEC Exports
---------------------------------------- */

module.exports = router;

// !SEC
