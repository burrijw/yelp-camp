const faker = require("faker");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Sugar = require("sugar");
Sugar.extend();

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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
  for (let i = 0; i < 50; i++) {
    const camp = new Campground({
      title: faker.fake("{{address.streetName}} Campground").titleize(),
      image: "https://source.unsplash.com/collection/220381",
      price: faker.commerce.price(),
      description: faker.lorem.sentences(),
      location: faker.fake(
        "{{datatype.number}} {{address.streetName}}, {{address.city}}, {{address.state}} {{address.zipCode}}"
      ),
    });
    await camp.save();
    console.log(`added new site to db`);
  }
};

seedData().then(() => {
  console.log("done");
});
