const passport = require("passport");

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const ErrorHandler = require("./ErrorHandler.class");

const { generateToken } = require("./Extra.functions");
const user = require("../models/User.models");
require('dotenv').config()
const CLIENT_ID_RENDER = process.env.CLIENT_ID
const CLIENT_SECRET_RENDER = process.env.CLIENT_SECRET

const CLIENT_ID_LOCAL = process.env.id
const CLIENT_SECRET_LOCAL = process.env.secret
// console.log(CLIENT_SECRET_LOCAL);


function passportHandler() {
    passport.use(new GoogleStrategy(
        {
            clientID: CLIENT_ID_LOCAL, // Use your actual client ID
            clientSecret: CLIENT_SECRET_LOCAL, // Use your actual client secret
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"], // Requesting access to basic profile and email
        },
        async function (accessToken, refreshToken, profile, done) {

            try {
                // Check if the user already exists
                let User = await user.findOne({ email: profile._json.email });

                if (!User) {
                    // If the user doesn't exist, create a new user
                    let createuser = await user.create({
                        name: profile.displayName,
                        email: profile._json.email,
                        profile_picture: profile?._json.picture,
                        signUpBy: "Google", // Mark as signed up via Google,
                        token: "null",
                        phone_number: null,
                    });

                    const token = await generateToken({ id: createuser._id, email: createuser.email }, process.env.JWT_SECRET)

                    if (!token) next(new ErrorHandler(500, "Something went wrong while giving you token! please try Again"))
                    createuser.token = token
                    await createuser.save({ validateBeforeSave: false })
                    // Attach the token to the user object
                    // user.token = token;
                    return done(null, { ...createuser.toObject(), token }); // Pass the user object with the token
                }

                // Create a JWT token

                const token = await generateToken({ id: User._id, email: User.email },
                    process.env.JWT_SECRET)

                User.token = token
                await User.save({ validateBeforeSave: false })

                // Attach the token to the user object
                // user.token = token;

                return done(null, { ...User.toObject(), token }); // Pass the user object with the token
            } catch (error) {
                return done(new ErrorHandler(error.status, error.message))
            }
        }
    )
    );
}
module.exports = passportHandler