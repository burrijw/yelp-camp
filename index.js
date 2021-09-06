/* ------------------------
SECTION Imports
------------------------ */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const states = require('./seed/states');
const morgan = require('morgan');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

// !SECTION

// SECTION DB Connect
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  console.log('Database connected');
});

// !SECTION

// Init the express app
const app = express();

app.set('view engine', 'pug'); // Set the view engine for templates
app.set('views', path.join(__dirname, 'views'));

// SECTION Middleware

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

// !SECTION

/* ------------------------
SECTION Routes
------------------------ */

// TODO Move routes to their own file and import into index.js using express router

app.get('/', (req, res) => {
  // renders the home page
  res.render('layout');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
  // returns an index page with all campgrounds listed
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new', { states });
});

app.post(
  '/campgrounds',
  catchAsync(async (req, res) => {
    // generate a new campground model using the info provided in form on 'campground/new'
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground, states });
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    // use the spread operator to include the entire campground object
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));
// !SECTION

// catch 404's

app.all('*', (req, res, next) => {
  res.send('404 error -- page not found');
})

// Error handler

app.use((err, req, res, next) => {
  console.log(err);
  res.send('Whoa there -- something went wrong!')
});

// Init the server
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
