const otpModel = require("../models/OTP.model");
const user = require("../models/User.models");
const ErrorHandler = require("../others/ErrorHandler.class");
const { generateToken, hashPassword, comparePassword } = require("../others/Extra.functions");
const sendMail = require("../others/Nodemailer");

require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET
const createUser = async (req, res, next) => {
    try {
        const { fullName, email, password, mobilenumber = "" } = req?.body
        if (!email) {
            return next(ErrorHandler(404, "Email Fields is Required*"))
        } else if (!fullName) {
            return next(ErrorHandler(404, "Full Name Fields is Required*"))
        } else if (!password) {
            return next(ErrorHandler(404, "Password Fields is Required*"))
        }

        const findUser = await user.findOne({ email })
        if (findUser) {
            return next(new ErrorHandler(400, "Accunt Already Exists! Please Login"))
        }

        // let otp = Math.floor(1000 + Math.random() * 9000);
        // const setOTP = await otpModel.create({ email, emailOTP: otp })
        // const emailSent = await sendMail("shubham Garg", email, "OTP for Verification", _, `<h1>Your OTP for Verification is ${otp}<h1/>`)


        const hashedPass = await hashPassword(password)
        const createUser = await user.create({ fullName: fullName, password: hashedPass, email, signUpBy: "Email", token: "null", phone_number: mobilenumber })


        const token = await generateToken({ _id: createUser._id }, JWT_SECRET)
        createUser.token = token
        await createUser.save({ validateBeforeSave: false })
        res.status(201).json({ user: createUser, message: "OTP have Sent Successfully", success: true, token })



    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}



const sendOTP = async function (req, res, next) {
    try {
        const { email } = req?.body
        if (!email) {
            return next(new ErrorHandler(404, "Email Required"))
        }

        const findOTP = await otpModel.findOne({ email })
        if (findOTP.expiresAt > new Date(Date.now())) {
            return next(new ErrorHandler(404, "Wait 2 Minutes For Resend OTP....."))
        }
        if (findOTP) {
            let otp = Math.floor(1000 + Math.random() * 9000);
            const setOTP = await otpModel.findOneAndUpdate({ email },
                { emailOTP: otp, expiresAt: new Date(Date.now() + 2 * 60 * 1000) }, { new: true })

            const emailSent = await sendMail("shubham Garg", email, "OTP for Verification", _, `<h1>Your OTP for Verification is ${otp}<h1/>`)

            res.status(200).json({ message: `OTP sent Successfully on ${email}`, success: true })
        }

        let otp = Math.floor(1000 + Math.random() * 9000);
        const setOTP = await otpModel.create({ email, emailOTP: otp })
        const emailSent = await sendMail("shubham Garg", email, "OTP for Verification", _, `<h1>Your OTP for Verification is ${otp}<h1/>`)


        res.status(200).json({ message: `OTP sent Successfully on ${email}`, success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const verifyOTP = async function (req, res, next) {
    try {
        const { otp, email } = req?.body
        if (!otp) {
            return next(new ErrorHandler(404, "OTP Required"))
        }
        const findOTP = await otpModel.findOne({ email })
        if (!findOTP || findOTP?.expiresAt < new Date(Date.now())) {
            const deleteOTP = await otpModel.findOneAndDelete({ email })
            return next(new ErrorHandler(404, "OTP Expired"))
        }
        if (findOTP.emailOTP !== otp) {
            return next(new ErrorHandler(402, "Wrong OTP"))
        }
        const updateUser = await user.findOneAndUpdate({ email }, { isEmailVerified: true }, { new: true })
        const deleteOTP = await otpModel.findOneAndDelete({ email })
        res.status(200).json({ message: "User Email Verified Successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

module.exports = { createUser, sendOTP, verifyOTP }