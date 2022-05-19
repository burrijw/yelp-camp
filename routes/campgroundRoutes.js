/* ------------------------
    SEC: IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router();

//ANC Controllers
const campground = require('../controllers/campgroundController');

//ANC Utils and Functions
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//ANC Models
const Campground = require('../models/campground');


//!SEC

/* ------------------------
SEC ROUTES
------------------------ */

router.get(
    '/',
    catchAsync(campground.showAllCampgrounds)
);

router.get(
    // Show the form for adding a new campsite
    '/new',
    isLoggedIn,
    campground.renderNewForm
);

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    catchAsync(campground.createCampground)
);


router.get(
    '/:id',
    catchAsync(campground.showCampground)
);

router.get(
    '/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(campground.renderNewForm)
);

router.put(
    '/:id',
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campground.updateCampground));

router.delete(
    '/:id',
    isLoggedIn,
    isAuthor,
    catchAsync(campground.deleteCampground)
);

//!SEC

module.exports = router;
