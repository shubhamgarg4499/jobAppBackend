const express = require("express");
const { createUser, sendOTP, verifyOTP, SignIn, Logout, changePassword, ForgotPasswordOTP, verifyForgotPasswordOTP, workExperience, AboutMe, AddEducation, AddSkills, AddAppreciation, AddLanguage, uploadResume } = require("../controllers/User.controller");
const userRouter = express.Router()
const verifyTokenMiddleware = require("../middleswares/verifyJWT.middlewares");
const upload = require("../others/Multer.setup");

userRouter.route("/signup").post(createUser)
userRouter.route("/sendOTP").post(sendOTP)
userRouter.route("/verifyOTP").post(verifyOTP)
userRouter.route("/signin").post(SignIn)
userRouter.route("/logout").post(verifyTokenMiddleware, Logout)



userRouter.route("/forgotpasswordotp").post(ForgotPasswordOTP)
userRouter.route("/verifyforgotpasswordotp").post(verifyForgotPasswordOTP)
userRouter.route("/changepassword").post(changePassword)


userRouter.route("/aboutme").post(verifyTokenMiddleware, AboutMe)
userRouter.route("/workexperience").post(verifyTokenMiddleware, workExperience)
userRouter.route("/addeducation").post(verifyTokenMiddleware, AddEducation)
userRouter.route("/addskills").post(verifyTokenMiddleware, AddSkills)
userRouter.route("/addappreciation").post(verifyTokenMiddleware, AddAppreciation)
userRouter.route("/addlanguage").post(verifyTokenMiddleware, AddLanguage)
userRouter.route("/uploadresume").post(verifyTokenMiddleware, upload.single("resume"), uploadResume)

module.exports = userRouter