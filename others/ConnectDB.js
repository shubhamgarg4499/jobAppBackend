
const mongoose = require('mongoose');
const ErrorHandler = require('./ErrorHandler.class');
require("dotenv").config()
//Set up default mongoose connection
const mongoDB_Url_ATLAS = process.env.MONGODB_URL_ATLAS;
const mongoDB_Url_LOCAL = process.env.MONGODB_URL;

async function connectDB() {
    try {
        let connect = await mongoose.connect(mongoDB_Url_ATLAS);
        console.log(connect.connection.host)
    } catch (error) {
        const message = error?.message || "Something went wrong while connecting DB"
        const status = error?.status || 500
        throw new ErrorHandler(status, message)

    }
}
module.exports = connectDB