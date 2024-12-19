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
    zipCode: {
        type: String
    },
    startDate: {
        type: String
    },
    EndDate: {
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
    fieldOfSudy: {
        type: String
    },
    startDate: {
        type: String
    },
    EndDate: {
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
    oral: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"]
    },
    Written: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"]
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
        type: [{ workExperience }]
    },
    education: {
        type: [{ Education }]
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
        unique: true,
        sparse: true,
    },
    countryCode: {
        type: String,
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
        required: true,
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
    }
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = hashPassword(this.password)
        return next();
    } catch (error) {
        next(new ErrorHandler(error.status, error.message));
    }
});


const user = mongoose.model("user", userSchema)

module.exports = user