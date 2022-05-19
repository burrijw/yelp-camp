const Campground = require('../models/campground');
const states = require('../seed/states');

module.exports.showAllCampgrounds = async (req, res) => {
    // returns an index page with all campgrounds listed
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new', { states });
}

// Process for input to create a new campground and save it to the db
module.exports.createCampground = async (req, res) => {
    // generate a new campground model using the info provided in form on 'campground/new'
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `You've successfully created ${campground.title}`);
    res.redirect(`/campgrounds/${campground._id}`);
}

// Show a particular campground page based on the ID
module.exports.showCampground = async (req, res) => {
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
}

// Render a form for editing a campground
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The specified campground could not be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground, states });
}

// Update campground info
module.exports.updateCampground = async (req, res) => {
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
}

// Delete campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "The campground has been deleted.");
    res.redirect('/campgrounds');
}
