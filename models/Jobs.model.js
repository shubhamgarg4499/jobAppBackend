let mongoose = require('mongoose');




let jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    jobPosition: {
        type: String,
        required: true
    },
    jobWorkplace: {
        type: String,
        enum: ["onsite", "remote", "hybrid"],
        required: true,
        lowercase: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ["part time", "full time"],
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    lastDate: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: ["private", "government", "ngo", "freelance"],
        lowercase: true
    },
    salaryFrom: {
        type: String
    },
    salaryTo: {
        type: String
    },
    qualification: {
        type: [String]
    },
    jobStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }

}, { timestamps: true })

let job = mongoose.model("job", jobSchema)


// let jobsCategorySchema = new mongoose.Schema({
//     category: {
//         type: String,
//         required: true,
//         enum: ["Private", "Government", "NGO", "Freelance"]
//     }
// }, { timestamps: true })
// let jobCategory = mongoose.model("jobCategory", jobsCategorySchema)
module.exports = { job }