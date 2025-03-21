const mongoose = require("mongoose");

// user
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    verify2FAOtP: {
        type: String
    },
    verify2FAOtPExpiresAt: {
        type: Date
    },
    otp: {
        type: String 
    },
    otpExpiresAt: {
        type: Date
    }
}, {timestamps: true});


module.exports = mongoose.model("User", UserSchema);