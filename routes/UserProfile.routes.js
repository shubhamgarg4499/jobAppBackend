const express = require("express");
const { createUser, sendOTP, verifyOTP, SignIn, Logout, changePassword, ForgotPasswordOTP, verifyForgotPasswordOTP } = require("../controllers/User.controller");
const userRouter = express.Router()
const verifyTokenMiddleware = require("../middleswares/verifyJWT.middlewares")

userRouter.route("/signup").post(createUser)
userRouter.route("/sendOTP").post(sendOTP)
userRouter.route("/verifyOTP").post(verifyOTP)
userRouter.route("/signin").post(SignIn)
userRouter.route("/logout").post(verifyTokenMiddleware, Logout)



userRouter.route("/forgotpasswordotp").post(ForgotPasswordOTP)
userRouter.route("/verifyforgotpasswordotp").post(verifyForgotPasswordOTP)

userRouter.route("/changepassword").post(changePassword)
module.exports = userRouter