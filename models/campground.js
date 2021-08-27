const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const CampgroundSchema = new Schema({
//   title: String,
//   image: String,
//   price: Number,
//   description: String,
//   location: String,
// });

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    zipcode: String,
  },
});

module.exports = mongoose.model("Campground", CampgroundSchema);
