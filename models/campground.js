const { string } = require("joi");
const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	images: [
		{
			url: String,
			filename: String
		}
	],
	// {
	// 	type: String,
	// 	default: "https://source.unsplash.com/collection/220381/1600x900",
	// }

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
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		})
	}
})

module.exports = mongoose.model("Campground", CampgroundSchema);
