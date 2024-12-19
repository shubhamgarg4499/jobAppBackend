const otpModel = require("../models/OTP.model");
const user = require("../models/User.models");
const ErrorHandler = require("../others/ErrorHandler.class");
const { generateToken, hashPassword, comparePassword } = require("../others/Extra.functions");
const sendMail = require("../others/Nodemailer");

require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET
const createUser = async (req, res, next) => {
    try {
        let { fullName, email, password, mobilenumber } = req?.body

        if (!mobilenumber) {
            mobilenumber = null
        }
        // Validate required fields
        if (!email) return next(ErrorHandler(400, "Email field is required"));
        if (!fullName) return next(ErrorHandler(400, "Full Name field is required"));
        if (!password) return next(ErrorHandler(400, "Password field is required"));


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
        const hashedPass = await hashPassword(password)

        const createUser = await user.create({ fullName: fullName, password: hashedPass, email, signUpBy: "Email", token: "null", phone_number: mobilenumber })
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
        const { email, password } = req?.body
        // validate
        if (!email) { return next(new ErrorHandler(400, "Email Required!")) }
        if (!password) { return next(new ErrorHandler(400, "Password Required!")) }

        // find user by given email
        const findUser = await user.findOne({ email })

        // validate user
        if (!findUser) { return next(new ErrorHandler(404, "User Not Found! Please SignUp")) }
        if (findUser.signUpBy == "Google") next(new ErrorHandler(404, "Your Account Is Created With Google ! Please SignIn with Google"))

        // checking password
        const isCorrectPassword = await comparePassword(password, findUser?.password)
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



module.exports = { createUser, sendOTP, verifyOTP, SignIn, Logout, changePassword, ForgotPasswordOTP, verifyForgotPasswordOTP } 