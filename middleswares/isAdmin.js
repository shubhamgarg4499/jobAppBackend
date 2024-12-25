const user = require("../models/User.models")
const ErrorHandler = require("../others/ErrorHandler.class")

const isAdmin = async (req, res, next) => {
    try {
        const { _id } = req?.user
        const findUser = await user.findById(_id)
        if (!findUser) return next(new ErrorHandler(404, "No user Found ! Token Error"))
        if (!findUser.isAdmin) return next(new ErrorHandler(400, "Only Admin can proceed this request"))
        return next()
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

module.exports = isAdmin