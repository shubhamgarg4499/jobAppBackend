const express = require("express");
const { userList } = require("../controllers/Jobs.controller");
const { createUser, sendOTP, verifyOTP, SignIn, Logout, changePassword, ForgotPasswordOTP, verifyForgotPasswordOTP, workExperience, AboutMe, AddEducation, AddSkills, AddAppreciation, AddLanguage, uploadResume, addDocuments, approveUser, blockUser, userJoinedToday, loginWithToken, userPerMonth, UnblockUser } = require("../controllers/User.controller");
const isAdmin = require("../middleswares/isAdmin");
const userRouter = express.Router()
const verifyTokenMiddleware = require("../middleswares/verifyJWT.middlewares");
const upload = require("../others/Multer.setup");

userRouter.route("/signin").post(SignIn)
userRouter.route("/logout").post(verifyTokenMiddleware, Logout)
userRouter.route("/sendOTP").post(sendOTP) ///email verification otp send
userRouter.route("/verifyOTP").post(verifyOTP) ///email verification
userRouter.route("/signup").post(createUser)
userRouter.route("/forgotpasswordotp").post(ForgotPasswordOTP) //////to send or resend forgot password otp 
userRouter.route("/verifyforgotpasswordotp").post(verifyForgotPasswordOTP)
userRouter.route("/changepassword").post(changePassword)

userRouter.route("/aboutme").post(verifyTokenMiddleware, AboutMe)
userRouter.route("/workexperience").post(verifyTokenMiddleware, workExperience)
userRouter.route("/addeducation").post(verifyTokenMiddleware, AddEducation)
userRouter.route("/addskills").post(verifyTokenMiddleware, AddSkills)
userRouter.route("/addappreciation").post(verifyTokenMiddleware, AddAppreciation)
userRouter.route("/addlanguage").post(verifyTokenMiddleware, AddLanguage)
userRouter.route("/uploadresume").post(verifyTokenMiddleware, upload.single("resume"), uploadResume)

// readme not added
userRouter.route("/adddocuments").post(verifyTokenMiddleware, upload.array("documents", 4), addDocuments)
// readme not added





userRouter.route("/userlist").get(verifyTokenMiddleware, isAdmin, userList)
userRouter.route("/loginwithtokenuser").post(verifyTokenMiddleware, loginWithToken)
// readme not added
userRouter.route("/approveuser").post(verifyTokenMiddleware, isAdmin, approveUser)
userRouter.route("/blockuser").post(verifyTokenMiddleware, isAdmin, blockUser)
userRouter.route("/unblockuser").post(verifyTokenMiddleware, isAdmin, UnblockUser)
userRouter.route("/userjoinedtoday").post(verifyTokenMiddleware, isAdmin, userJoinedToday)
userRouter.route("/userpermonth").post(verifyTokenMiddleware, isAdmin, userPerMonth)
// readme not added

// for admin///////////
userRouter.route("/loginwithtoken").post(verifyTokenMiddleware, isAdmin, loginWithToken)
// for admin///////////
module.exports = userRouter