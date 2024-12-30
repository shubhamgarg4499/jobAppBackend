const fs = require('fs');
const otpModel = require("../models/OTP.model");
const user = require("../models/User.models");
const ErrorHandler = require("../others/ErrorHandler.class");
const { generateToken, hashPassword, comparePassword } = require("../others/Extra.functions");
const sendMail = require("../others/Nodemailer");

require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET


// need to add documents
const createUser = async (req, res, next) => {
    try {
        let { fullName, email, password, mobilenumber, userType, notification = false } = req?.body

        if (!mobilenumber) {
            mobilenumber = null
        }
        // Validate required fields
        if (!email) return next(ErrorHandler(400, "Email field is required"));
        if (!fullName) return next(ErrorHandler(400, "Full Name field is required"));
        if (!password) return next(ErrorHandler(400, "Password field is required"));
        if (!userType) return next(ErrorHandler(400, "User Type/Account Type is Required"));


        // Check for existing user
        const findUser = await user.findOne({ email })
        if (findUser) {
            if (findUser.isEmailVerified) {
                return next(new ErrorHandler(400, "Account already exists! Please log in."));
            } else {
                return next(new ErrorHandler(400, "Account already exists! But Email not verified. Please verify your email."));
            }
        }
        // password hashing
        // const hashedPass = await hashPassword(password)

        const createUser = await user.create({ fullName: fullName, password, email, signUpBy: "Email", token: "null", phone_number: mobilenumber, userType, notification })
        // generate token
        const token = await generateToken({ _id: createUser._id }, JWT_SECRET)
        createUser.token = token
        await createUser.save({ validateBeforeSave: false })


        // response
        res.status(201).json({ user: createUser, message: "User Created Successfully! Please verify Your Email", success: true, token })

    } catch (error) {
        return next(new ErrorHandler(error.status, error))
    }
}

const sendOTP = async function (req, res, next) {
    try {
        const { email } = req?.body

        // validate
        if (!email) {
            return next(new ErrorHandler(404, "Email Required"))
        }

        const findUser = await user.findOne({ email })
        if (!findUser) {
            return next(new ErrorHandler(404, "User Not Found! Signup First!"))
        }
        if (findUser.isEmailVerified) {
            return next(new ErrorHandler(400, "User Email Already Verified!"))
        }

        const findOTP = await otpModel.findOne({ email })
        if (findOTP && findOTP.expiresAt > Date.now()) {
            return next(new ErrorHandler(404, "Wait 2 Minutes For Resend OTP....."))
        }


        // Generate a new OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const expiryTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        // Update or create OTP in database
        if (findOTP) {
            findOTP.emailOTP = otp;
            findOTP.expiresAt = expiryTime;
            await findOTP.save({ validateBeforeSave: false });
        } else {
            await otpModel.create({ email, emailOTP: otp, expiresAt: expiryTime });
        }

        // sending OTP on email
        await sendMail(
            "Shubham Garg",
            email,
            "OTP for Verification",
            null,
            `<h1>Your OTP for verification is ${otp}</h1>`
        );



        // const setOTP = await otpModel.create({ email, emailOTP: otp })
        // const emailSent = await sendMail("shubham Garg", email, "OTP for Verification", _, `<h1>Your OTP for Verification is ${otp}<h1/>`)


        res.status(200).json({ message: `OTP sent Successfully on ${email}`, success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const verifyOTP = async function (req, res, next) {
    try {
        const { otp, email } = req?.body

        // validate fields
        if (!otp) {
            return next(new ErrorHandler(404, "OTP Required"))
        }
        if (!email) {
            return next(new ErrorHandler(404, "Email Required"))
        }

        // finding otp for a specific email
        const findUser = await user.findOne({ email })
        if (!findUser) {
            return next(new ErrorHandler(404, "User Not Found By This E-mail! SignUp First"))
        }
        if (findUser.isEmailVerified) {
            return next(new ErrorHandler(400, "User Email Already Verified!"))

        }
        const findOTP = await otpModel.findOne({ email })
        if (!findOTP) {
            return next(new ErrorHandler(404, "No OTP found for this email. Please try again."))
        }

        // verifing otp expiring time 
        if (findOTP?.expiresAt < Date.now()) {
            await otpModel.deleteOne({ email })
            return next(new ErrorHandler(400, "OTP Expired! Please request a new OTP"))
        }

        if (findOTP.emailOTP !== otp) {
            return next(new ErrorHandler(402, "Incorrect OTP. Please try again."))
        }
        const updateUser = await user.findOneAndUpdate({ email }, { isEmailVerified: true }, { new: true })

        if (!updateUser) {
            return next(new ErrorHandler(500, "User not found. Unable to verify email."));
        }
        await otpModel.deleteOne({ email });


        res.status(200).json({ message: "User Email Verified Successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const SignIn = async function (req, res, next) {
    try {
        const { email, password, userType } = req?.body
        console.log(userType);
        // console.log(email, password);
        // validate
        if (!email) { return next(new ErrorHandler(400, "Email Required!")) }
        if (!password) { return next(new ErrorHandler(400, "Password Required!")) }
        if (!userType) { return next(new ErrorHandler(400, "User Type / Account Type Required")) }

        // find user by given email
        const findUser = await user.findOne({ email })
        if (!findUser) { return next(new ErrorHandler(404, "Invalid Email / Password")) }
        // validate user
        if (findUser.userType !== userType.toLowerCase()) { return next(new ErrorHandler(404, "Profile Error! Cant Sign In")) }
        if (!findUser) { return next(new ErrorHandler(404, "User Not Found! Please SignUp")) }
        if (findUser.signUpBy == "Google") next(new ErrorHandler(404, "Your Account Is Created With Google ! Please SignIn with Google"))

        // checking password
        const isCorrectPassword = await comparePassword(password, findUser.password)
        // console.log(isCorrectPassword)
        if (!isCorrectPassword) { return next(new ErrorHandler(400, "Invalid Email or Password!")) }

        // generate token
        const token = await generateToken({ _id: findUser._id }, JWT_SECRET)
        findUser.token = token
        await findUser.save({ validateBeforeSave: false })
        // response
        res.status(200).json({ user: findUser, token, success: true, message: "User Login Successfully" })
    } catch (error) {
        return next(new ErrorHandler(error?.status, error?.message))
    }
}

const Logout = async function (req, res, next) {
    try {
        const { _id } = req?.user
        // console.log(String(_id))
        await user.findByIdAndUpdate(String(_id), { token: "" }, { new: true })
        res.status(200).json({ success: true, message: "User Logged out Successfully" })
    } catch (error) {
        return next(new ErrorHandler(error?.status, error?.message))
    }
}

const ForgotPasswordOTP = async function (req, res, next) {
    try {
        const { email } = req?.body
        if (!email) {
            return next(new ErrorHandler(400, "Email Required"))
        }

        const findUser = await user.findOne({ email })
        if (!findUser) return next(new ErrorHandler(404, "User Not Found! Please SignUp"))
        const findOTP = await otpModel.findOne({ email })

        if (findOTP && findOTP.expiresAt > Date.now()) {
            return next(new ErrorHandler(400, "Wait 2 Minutes to Send OTP...."))
        }

        // Generate a new OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiryTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        // Update or create OTP in database
        if (findOTP) {
            findOTP.forgotPasswordOTP = otp;
            findOTP.expiresAt = expiryTime;
            await findOTP.save({ validateBeforeSave: false });
        } else {
            await otpModel.create({ email, forgotPasswordOTP: otp, expiresAt: expiryTime });
        }

        await sendMail(
            "Shubham Garg",
            email,
            "OTP for Forgot Password",
            null,
            `<h1>Your OTP for Forgot Password is ${otp}</h1>`
        );

        res.status(200).json({ success: true, message: `OTP Sent Successfully on ${email}` })
    } catch (error) {
        return next(new ErrorHandler(error.status, error))
    }
}

const verifyForgotPasswordOTP = async function (req, res, next) {
    try {
        const { otp, email } = req?.body

        // validate fields
        if (!otp) {
            return next(new ErrorHandler(404, "OTP Required"))
        }
        if (!email) {
            return next(new ErrorHandler(404, "Email Required"))
        }


        const findOTP = await otpModel.findOne({ email })
        if (!findOTP) {
            return next(new ErrorHandler(404, "No OTP found for this email. Please try again."))
        }

        // verifing otp expiring time 
        if (findOTP?.expiresAt < Date.now()) {
            await otpModel.deleteOne({ email })
            return next(new ErrorHandler(400, "OTP Expired! Please request a new OTP"))
        }

        if (findOTP.forgotPasswordOTP !== otp) {
            return next(new ErrorHandler(402, "Incorrect OTP. Please try again."))
        }

        await otpModel.deleteOne({ email });

        res.status(200).json({ message: "Correct OTP", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const changePassword = async function (req, res, next) {
    try {
        const { email, newPassword } = req?.body

        // validation
        if (!email) return next(new ErrorHandler(400, "Email Required"))
        if (!newPassword) return next(new ErrorHandler(400, "New Password Required"))

        // find user and check
        const findUser = await user.findOne({ email })
        if (!findUser) return next(new ErrorHandler(404, "User Not Found!"))


        findUser.password = newPassword
        const savedUser = await findUser.save()
        res.status(200).json({ success: true, message: "Password Changed!" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error))
    }
}

// controllers for user details

const AboutMe = async (req, res, next) => {
    try {
        const { _id } = req?.user
        const { description } = req?.body
        if (!description) return next(new ErrorHandler(400, "Description Required*"))
        const findUser = await user.findByIdAndUpdate(_id, { about: description }, { new: true })
        res.status(200).json({ success: true, message: "About Section is Updated" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const workExperience = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { jobInfo } = req?.body
        if (typeof jobInfo != "object") {
            return next(new ErrorHandler(400, "Only Allow `ARRAY OF OBJECT`"))
        }
        if (jobInfo.length < 1) {
            return next(new ErrorHandler(400, "Need Atleast One Object To Add"))
        }

        if (jobInfo.some(element => {
            return !(
                element.jobTitle.trim() &&
                element.company.trim() &&
                element.startDate.trim()
            );
        })) {
            return next(new ErrorHandler(400, "All fields (jobTitle, company, and startDate) must be filled in every entry."))

        }
        if (jobInfo.some(element => {
            return !element.endDate && !element.stillWorkingThere
        })) {
            return next(new ErrorHandler(400, "Please Select End Date or Check if You are Still Working There"))

        }
        await user.findByIdAndUpdate(_id, {
            $addToSet: {
                experience: { $each: jobInfo }
            }
        })
        res.status(200).json({ success: true, message: "Your Experience Section has been updated Successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const AddEducation = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { educationInfo } = req?.body
        if (typeof educationInfo != "object") {
            return next(new ErrorHandler(400, "Only Allow `ARRAY OF OBJECT`"))
        }
        if (educationInfo.length < 1) {
            return next(new ErrorHandler(400, "Need Atleast One Object To Add"))
        }

        if (educationInfo.some(element => {
            return !(
                element.education.trim() &&
                element.institute.trim() &&
                element.fieldOfStudy.trim() &&
                element.startDate.trim()
            );
        })) {
            return next(new ErrorHandler(400, "All fields (Education, Institute,Field Of Study and Start Date) must be filled in every entry."))

        }
        if (educationInfo.some(element => {
            return !element.endDate && !element.stillPursuing
        })) {
            return next(new ErrorHandler(400, "Please Select End Date or Check if You are Still Pursuing It "))

        }
        await user.findByIdAndUpdate(_id, {
            $addToSet: {
                education: { $each: educationInfo }
            }
        });
        res.status(200).json({ success: true, message: "Your Education Section has been updated Successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error))
    }
}


const AddSkills = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { skill } = req.body
        if (typeof skill != "object") {
            return next(new ErrorHandler(400, "Only Allow `ARRAY`"))
        }

        if (skill.length < 1) return next(new ErrorHandler(400, "Atleast 1 Skill required to Add"))

        // for (let element of skill) {
        //     await user.findByIdAndUpdate(_id, {
        //         $addToSet: {
        //             skills: element
        //         }
        //     })
        // }
        await user.findByIdAndUpdate(_id, {
            $addToSet: {
                skills: { $each: skill }
            }
        });
        res.status(200).json({ success: true, message: "Skills Section Updated" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const AddAppreciation = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { appre } = req?.body
        if (typeof appre != "object") {
            return next(new ErrorHandler(400, "Only Allow `ARRAY OF OBJECT`"))
        }
        if (appre.length < 1) {
            return next(new ErrorHandler(400, "Need Atleast One Object To Add"))
        }

        if (appre.some(element => {
            return !(
                element.awardName.trim() &&
                element.category.trim() &&
                element.year.trim()
            );
        })) {
            return next(new ErrorHandler(400, "Fields (Award Name, Category & Year) must be filled."))

        }
        await user.findByIdAndUpdate(_id, {
            $addToSet: {
                appreciation: { $each: appre }
            }
        });
        res.status(200).json({ success: true, message: "Your Appreciation Section has been updated Successfully" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const AddLanguage = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { langKnown } = req?.body

        if (typeof langKnown != "object") {
            return next(new ErrorHandler(400, "Only Allow `ARRAY OF OBJECT`"))
        }

        if (langKnown.length < 1) {
            return next(new ErrorHandler(400, "Need Atleast One Object To Add"))
        }

        if (langKnown.some(element => {
            return !(
                element.languageName.trim() &&
                element.oralLevel.trim() &&
                element.writtenLevel.trim()
            );
        })) {
            return next(new ErrorHandler(400, "Fields (Language Name, Oral Level & Written Level) must be filled."))
        }

        await user.findByIdAndUpdate(_id, {
            $addToSet: {
                language: { $each: langKnown }
            }
        });

        res.status(200).json({ success: true, message: "Your Language Section has been updated Successfully" })

    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const uploadResume = async (req, res, next) => {
    try {
        const { _id } = req.user
        const userResume = req?.file

        // check given file is pdf or not
        if (userResume.originalname.split(".")[1] !== "pdf") {
            fs.unlink(userResume.path, (error) => {
                if (error) return next(new ErrorHandler(400, error.message))
            })
            return next(new ErrorHandler(400, "Only PDF File Allowed"))
        }

        // checking user previous resume and delete it 
        const findUser = await user.findById(_id)
        if (findUser.resume) {
            fs.unlink(findUser.resume, (error) => {
                if (error) return next(new ErrorHandler(400, error.message))
            })
        }
        const findAndUpdateUser = await user.findByIdAndUpdate(_id, { resume: userResume.path }, { new: true })

        res.status(200).json({ message: "Resume Updated Successfully", success: true, resume: findAndUpdateUser.resume })

    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const addDocuments = async (req, res, next) => {
    try {
        const { _id } = req?.user
        const documents = req?.files
        // res.send(documents)
        // if (typeof document !== "object") return next(new ErrorHandler(400, "Only Array Of object Allowed"))
        if (documents.length < 1) return next(new ErrorHandler(400, "Need Atleast One Document"))
        // if (email) return next(new ErrorHandler(400, "Need Email ID"))
        let docs = [];
        for (const iterator of documents) {
            // console.log(iterator);
            docs.push({ documentName: iterator.filename, documentPhoto: iterator.path })
            // documentName
            // documentPhoto
        }

        const findUpdate = await user.findByIdAndUpdate(_id, {
            $push: {
                documents: docs
            }
        }, {
            new: true
        });
        res.status(200).json({ user: findUpdate })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const approveUser = async (req, res, next) => {
    try {
        const { id } = req.query
        const { status } = req?.body
        if (!id) return next(new ErrorHandler(400, "User ID required"))
        if (!status) return next(new ErrorHandler(400, "Status required"))
        const find = await user.findByIdAndUpdate(id, { approval: status == "approved" ? "approved" : "rejected" }, { new: true })
        res.status(200).json({ message: status == "approved" ? "Approved successfully" : "Rejected successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const blockUser = async (req, res, next) => {
    try {
        const { id } = req.query
        if (!id) return next(new ErrorHandler(404, "User ID not Found!"))
        await user.findByIdAndUpdate(id, { isBlocked: true }, { new: true })
        res.status(200).json({ message: "User Blocked", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
const UnblockUser = async (req, res, next) => {
    try {
        const { id } = req.query
        if (!id) return next(new ErrorHandler(404, "User ID not Found!"))
        await user.findByIdAndUpdate(id, { isBlocked: false }, { new: true })
        res.status(200).json({ message: "User Unblocked Successfuly", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const userJoinedToday = async (req, res, next) => {
    try {
        const dayStart = new Date()
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date()
        dayEnd.setHours(23, 59, 59, 999)

        const userFind = await user.find({
            createdAt: { $gte: dayStart, $lt: dayEnd }
        })
        res.send(userFind)
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const userPerMonth = async (req, res, next) => {
    try {
        const allUsers = await user.aggregate([
            {
                $addFields: {
                    createdAt: { $toDate: "$createdAt" } // Convert to Date if it's a timestamp
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    userCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // console.log(v);
        res.send(allUsers)

    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

// for keep user login until user have valid token
const loginWithToken = async (req, res, next) => {
    try {
        const { _id } = req?.user
        if (!_id) return next(new ErrorHandler(402, "UNAUTHORISED REQUEST"))
        const findUser = await user.findById(_id)
        if (!findUser) return next(new ErrorHandler(402, "UNAUTHORISED REQUEST"))
        res.status(200).json({ message: "SuccessFully Login", user: findUser, success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
module.exports = { createUser, sendOTP, verifyOTP, SignIn, Logout, changePassword, ForgotPasswordOTP, verifyForgotPasswordOTP, AboutMe, workExperience, AddEducation, AddSkills, AddAppreciation, AddLanguage, uploadResume, addDocuments, approveUser, blockUser, userJoinedToday, loginWithToken, userPerMonth, UnblockUser } 