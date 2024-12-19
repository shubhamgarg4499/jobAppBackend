const mongoose = require("mongoose")
const { Schema } = mongoose

const otpSchema = new Schema({
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true,
        trim: true
    },
    emailOTP: {
        type: String,
    },
    phoneNumberOTP: {
        type: String,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: function () {
            return new Date(Date.now() + 2 * 60 * 1000)
        }
    }
})

const otpModel = mongoose.model("otpModel", otpSchema)

module.exports = otpModel