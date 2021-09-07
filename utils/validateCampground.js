const Joi = require('Joi');

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.object({
            address: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            zipcode: Joi.string()
        }).required()
    }).required()
});

module.exports = campgroundSchema;