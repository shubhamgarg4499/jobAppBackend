const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    jobid: {
        type: mongoose.Types.ObjectId,
        ref: "job",
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    role: {
        type: String,
        required: true
    },
    time_applied: {
        type: Date,
        default: Date.now
    },
    cover_letter: {
        type: String,
    },
    notes: {
        type: String,
    },
    interview_date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Rejected", "Hired", "Saved"],
        default: "Applied",
    },
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
