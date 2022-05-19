const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Sugar = require("sugar");
Sugar.extend();

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("successful connection to db: yelp-camp");
  })
  .catch((error) => {
    console.log("Oh no, there's been an error!");
    console.log(error);
  });

const seedData = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 25; i++) {
    const state = faker.address.stateAbbr();
    const camp = new Campground({
      title: faker.fake("{{address.streetName}} Campground").titleize(),
      image: "https://source.unsplash.com/collection/220381/1600x900",
      price: faker.commerce.price(),
      description: faker.lorem.sentences(),
      location: {
        address: faker.fake("{{datatype.number}} {{address.streetName}}"),
        city: faker.address.cityName(),
        state: state,
        zipcode: faker.address.zipCodeByState(state),
      },
      author: '61402e6154beb98713a507bd'
    });
    await camp.save();
    console.log(`added new site to db`);
  }
};

seedData().then(() => {
  console.log("done");
});
