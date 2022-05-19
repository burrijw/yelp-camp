/* ------------------------
SEC IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router({ mergeParams: true });

//ANC Utils
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview } = require('../middleware');

//ANC Controllers
const reviews = require('../controllers/reviewsController');

//!SEC

/* ----------------------------------------
SEC ROUTES
---------------------------------------- */

// add a new review
router.post(
    '/',
    isLoggedIn,
    validateReview,
    catchAsync(reviews.createReview)
)

// delete a review
router.delete(
    '/:reviewId',
    isLoggedIn,
    catchAsync(reviews.deleteReview)
)

// !SEC

module.exports = router;

