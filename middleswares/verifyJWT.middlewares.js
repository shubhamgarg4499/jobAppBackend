const jwt = require('jsonwebtoken');
const user = require('../models/User.models');
const ErrorHandler = require('../others/ErrorHandler.class');


const verifyTokenMiddleware = async (req, res, next) => {
    const token = req?.query?.token || req.headers.authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
        return next(new ErrorHandler(401, "Unauthorised Request: No token provided"))
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            const findUser = await user.findOne({ token })
            if (!findUser) return next(new ErrorHandler(401, "Token expired or Wrong token"))
            if (findUser.isBlocked) return next(new ErrorHandler(401, "You are blocked You cant access this app"))
            req.user = findUser
            next()
        }

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorHandler(401, "Unauthorized request: Token has expired"));
        } else if (error.name === "JsonWebTokenError") {
            return next(new ErrorHandler(401, "Unauthorized request: Token is invalid"));
        } else {
            // Catch-all for other errors
            return next(new ErrorHandler(error.status, error.message));
        }
    }
}

module.exports = verifyTokenMiddleware