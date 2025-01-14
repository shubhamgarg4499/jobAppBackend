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
        enum: ["private", "ngo", "freelance"],
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


const govtJobSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    postName: {
        type: String,
        required: true
    },
    qualification: {
        type: [String],
        required: true
    },
    totalNoOfPosts: {
        type: Number
    },
    department: {
        type: String,
        required: true
    },
    officialLink: {
        type: String
    },
    jobPostedOn: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        endDate: {
            type: Date,
            validate: {
                validator: function (v) {
                    return v > this.jobPostedOn; // Ensure endDate is after jobPostedOn
                },
                message: "End date must be after the posting date.",
            },
        },
    },
    jobType: {
        type: String,
        enum: ["central", "state"],
        lowercase: true,
        required: true
    },
    state: {
        type: String,
        lowercase: true,

    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const govtJobs = mongoose.model("govtJobs", govtJobSchema)
module.exports = { job, govtJobs }