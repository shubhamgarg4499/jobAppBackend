const express = require("express");
const { createUser } = require("../controllers/User.controller");
const userRouter = express.Router()

userRouter.route("/signup").post(createUser)

module.exports = userRouter