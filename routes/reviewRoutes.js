/* ------------------------
SEC IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router({ mergeParams: true });

//ANC Utils
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviewSchema = require('../utils/validationSchemas');

//ANC Models
const Review = require('../models/review');
const Campground = require('../models/campground');

//!SEC

/* ----------------------------------------
SEC MIDDLEWARE
---------------------------------------- */

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log('a valid review was submitted.');
        next();
    }
};

// !SEC


/* ----------------------------------------
SEC ROUTES
---------------------------------------- */

// add a new review
router.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    // find campground to add review
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // create a new review and save to campground
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// edit a review

// delete a review
router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
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

