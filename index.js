const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const Campground = require("./models/campground");

// connect db
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("successful connection to db: yelp-camp");
  })
  .catch((error) => {
    console.log("Oh no, there's been an error!");
    console.log(error);
  });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

// * VIEW ENGINE

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// * ROUTING

app.get("/", (req, res) => {
  res.render("home.pug");
});

// create
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

//read
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// update
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    {
      ...req.body.campground,
    },
    { new: true }
  );
  res.redirect(`/campgrounds/${campground._id}`);
});

// delete

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// 404 Page

app.use((req, res) => {
  res.status(404).send("The requested page or resource could not be found");
});

// * LISTENER...

app.listen(3000, () => {
  console.log("express app is listening on port 3000");
});
