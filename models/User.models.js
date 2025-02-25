const mongoose = require('mongoose')

// const bcrypt = require('bcryptjs');
const ErrorHandler = require('../others/ErrorHandler.class');
const { hashPassword } = require('../others/Extra.functions');

const address = new mongoose.Schema({
    street: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    country: {
        type: String
    },

})


const workExperience = new mongoose.Schema({
    jobTitle: {
        type: String
    },
    company: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    stillWorkingThere: {
        type: Boolean
    },
    description: {
        type: String
    }

})

const Education = new mongoose.Schema({
    education: {
        type: String
    },
    institute: {
        type: String
    },
    fieldOfStudy: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    stillPursuing: {
        type: Boolean
    },
    description: {
        type: String
    }

})

const LanguageKnown = new mongoose.Schema({
    languageName: {
        type: String
    },
    oralLevel: {
        type: String,
        enum: {
            values: ["Beginner", "Intermediate", "Advanced"],
            message: "{VALUE} is not a valid oral level."
        }
    },
    writtenLevel: {
        type: String,
        enum: {
            values: ["Beginner", "Intermediate", "Advanced"],
            message: "{VALUE} is not a valid oral level."
        }
    },
    primaryLanguage: {
        type: Boolean,
        default: false
    }
})

const Appreciation = new mongoose.Schema({
    awardName: {
        type: String
    },
    category: {
        type: String,

    },
    description: {
        type: String,

    },
    year: {
        type: String
    }
})
const addDocs = new mongoose.Schema({
    documentName: {
        type: String,
        required: true
    },
    documentPhoto: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: "User"
    },
    address: address,
    about: {
        type: String
    },
    experience: {
        type: [workExperience]
    },
    education: {
        type: [Education]
    },
    skills: {
        type: [String]
    },
    language: {
        type: [LanguageKnown]
    },
    appreciation: {
        type: [Appreciation]
    },
    resume: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    dob: {
        type: String
    },
    profile_picture: {
        type: String,
        default: null,
    },
    phone_number: {
        type: String,
        // unique: true,
        sparse: true,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    signUpBy: {
        type: String,
        enum: ["Google", "Email"],
        required: true
    },
    token: {
        type: String,
        sparse: true,
        unique: true
    },
    password: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    approval: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending",
        required: true,
        lowercase: true
    },
    documents: {
        type: [addDocs]
    },
    notification: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ["employer", "jobseeker"],
        lowercase: true,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    hasCompany: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        // console.log(this.password);
        this.password = await hashPassword(this.password)
        // console.log(this.password);
        next();
    } catch (error) {
        return next(new ErrorHandler(error.status, error));
    }
});


const user = mongoose.model("user", userSchema)

module.exports = user