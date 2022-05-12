/* ------------------------
SEC IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router({ mergeParams: true });

//ANC Utils
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview } = require('../middleware');


//ANC Models
const Review = require('../models/review');
const Campground = require('../models/campground');

//!SEC

/* ----------------------------------------
SEC ROUTES
---------------------------------------- */

// add a new review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    // find campground to add review
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // create a new review and save to campground
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Your review has been added successfully.")
    res.redirect(`/campgrounds/${campground._id}`);
}))

// edit a review

// delete a review
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    // await Campground.save();
    // const campgroundId = req.params.id;
    // const reviewId = req.params.reviewId;
    // const campground = await Campground.findById(campgroundId);
    // const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);

}))

// !SEC

module.exports = router;

