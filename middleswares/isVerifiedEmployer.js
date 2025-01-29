const user = require("../models/User.models")
const ErrorHandler = require("../others/ErrorHandler.class")

const isVerifiedEmployer = async (req, res, next) => {
    try {
        const { _id } = req?.user
        const findUser = await user.findById(_id)
        if (!findUser) return next(new ErrorHandler(404, "No user Found ! Token Error"))
        if (findUser.userType !="employer") return next(new ErrorHandler(400, "Only Employer can create company"))
        // if (!findUser.isEmailVerified || !findUser.isPhoneVerified) return next(new ErrorHandler(400, "Employer needs to be email and phone verified"))

        return next()
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

module.exports = isVerifiedEmployer