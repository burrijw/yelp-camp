/* ------------------------
    SEC: IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const router = express.Router();

//ANC Utils and Functions
const catchAsync = require('../utils/catchAsync');

//ANC Models
const { campgroundSchema } = require('../utils/validationSchemas');
const Campground = require('../models/campground');

//!SEC

/* ------------------------
SEC MIDDLEWARE
------------------------ */

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log('a valid campground was created.');
        next();
    }
};

//!SEC

/* ------------------------
SEC ROUTES
------------------------ */

router.get('/', catchAsync(async (req, res) => {
    // returns an index page with all campgrounds listed
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new', { states });
});

router.post(
    '/',
    validateCampground,
    catchAsync(async (req, res) => {
        // generate a new campground model using the info provided in form on 'campground/new'
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground, states });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        // use the spread operator to include the entire campground object
        ...req.body.campground,
    });
    res.redirect(`//${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

//!SEC 

module.exports = router;