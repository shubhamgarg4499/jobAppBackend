const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    time_applied: {
        type: Date,
        default: Date.now
    },
    cv: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    hired: {
        type: Boolean,
        default: false
    },
    shortlisted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
