/* ------------------------
SEC IMPORTS
------------------------ */

//ANC Node Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');


//ANC Utilities
const ExpressError = require('./utils/ExpressError');
const isLoggedIn = require('./middleware');

//ANC Routes
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

//ANC Models
const User = require('./models/user');

//!SEC

/* ------------------------
SEC CONNECT DATABASE
------------------------ */

//ANC Init the express app
const app = express();

//ANC Connect DB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
	console.log('Database connected');
});

//!SEC

/* ------------------------
SEC VIEW ENGINE
------------------------ */

app.set('view engine', 'pug'); // Set the view engine for templates
app.set('views', path.join(__dirname, 'views'));

//!SEC

/* ------------------------
SEC: MIDDLEWARE
------------------------ */

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//ANC Session

const sessionConfig = {
	secret: 'thisshouldbebetter',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));

//ANC Passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ANC Flash

app.use(flash());

//ANC Locals
app.use((req, res, next) => {
	if (!['/login', '/'].includes(req.originalUrl)) {
		req.session.returnTo = req.originalUrl;
	}
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//!SEC



/* ------------------------
  SEC: ROUTING
------------------------ */

app.use('/auth', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
	// renders the home page
	res.render('layout');
});

//!SEC

/* ------------------------
SEC ERROR HANDLERS
------------------------ */

//ANC catch 404's
app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found', 404));
});

//ANC Misc Error handler
app.use((err, req, res, next) => {
	const { statusCode = 500, message = 'something went wrong' } = err;
	res.status(statusCode).render('error', { statusCode, message });
});

//!SEC

/* ------------------------
SEC INIT SERVER
------------------------ */

app.listen(3000, () => {
	console.log('Serving on port 3000');
});

//!SEC
