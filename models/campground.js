const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://source.unsplash.com/collection/220381/1600x900",
  },
  price: {
    type: String,
    default: "0.00",
  },
  description: {
    type: String,
    default:
      "Salutantibus vitae elit libero, a pharetra augue. Ab illo tempore, ab est sed immemorabili.",
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipcode: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);
