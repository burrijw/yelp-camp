/* ----------------------------------------
SEC IMPORTS
---------------------------------------- */

//ANC Models
const Review = require('../models/review');
const Campground = require('../models/campground');

//!SEC

/* ----------------------------------------
SEC CONTROLLERS
---------------------------------------- */

//ANC Create a review
module.exports.createReview = async (req, res) => {
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
}

//ANC Delete a review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}

// !SEC
