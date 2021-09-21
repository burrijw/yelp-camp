const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLM = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// passport automatically adds fields for username and password, along with some other methods for verifying the PW
UserSchema.plugin(passportLM);

module.exports = mongoose.model('User', UserSchema);