/* ----------------------------------------
SEC Imports
---------------------------------------- */

//ANC Node Modules
const express = require('express');
const router = express.Router();
const passport = require('passport');

//ANC Utilities / Middleware
const catchAsync = require('../utils/catchAsync');

//ANC Models

//ANC Controller
const user = require('../controllers/userController')

// !SEC

/* ----------------------------------------
SEC ROUTES
---------------------------------------- */
//ANC New user registration form
router.get(
    '/register',
    user.renderNewUserForm
);

//ANC Create a new user
router.post(
    '/register',
    catchAsync(user.createUser)
);

//ANC Show the login form
router.get(
    '/login',
    user.renderLoginForm
);

// TODO Move user functions back to routes, maybe.

//ANC Check login for valid credentials, redir to campgrounds on success
router.post(
    '/login',
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }),
    user.login
);

router.get(
    '/logout',
    user.logout
)

// !SEC

/* ----------------------------------------
SEC Exports
---------------------------------------- */

module.exports = router;

// !SEC
