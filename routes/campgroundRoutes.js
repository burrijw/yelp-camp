/* ------------------------
    SEC: IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router();

//ANC Utils and Functions
const catchAsync = require('../utils/catchAsync');
const states = require('../seed/states');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//ANC Models
const Campground = require('../models/campground');


//!SEC

/* ------------------------
SEC ROUTES
------------------------ */

router.get('/', catchAsync(async (req, res) => {
    // returns an index page with all campgrounds listed
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new', { states });
});

router.post(
    '/',
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        // generate a new campground model using the info provided in form on 'campground/new'
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', `You've successfully created ${campground.title}`);
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'The specified campground could not be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The specified campground could not be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground, states });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    if (!campground) {
        req.flash('error', 'The specified campground could not be found.');
        return res.redirect('/campgrounds');
    }
    req.flash('success', `${campground.title} has been successfully updated!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "The campground has been deleted.");
    res.redirect('/campgrounds');
}));

//!SEC

module.exports = router;
