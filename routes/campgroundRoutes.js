/* ------------------------
    SEC: IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });''

//ANC Controllers
const campground = require('../controllers/campgroundController');

//ANC Utils and Functions
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//!SEC

/* ------------------------
SEC ROUTES
------------------------ */

router.route('/')
    // show campground
    .get(catchAsync(campground.showAllCampgrounds))
    // create a new campground
    .post(
        isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(campground.createCampground)
    );

router.route('/new')
    // Show new campground form
    .get(
        isLoggedIn,
        campground.renderNewForm
    );

router.route('/:id')
    .get(
        catchAsync(campground.showCampground)
    )
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image'),
        validateCampground,
        catchAsync(campground.updateCampground)
    )
    .delete(
        isLoggedIn,
        isAuthor,
        catchAsync(campground.deleteCampground)
    );

router.route('/:id/edit')
    .get(
        isLoggedIn,
        isAuthor,
        catchAsync(campground.renderNewForm)
    );

//!SEC

module.exports = router;
