const passport = require("passport");

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const ErrorHandler = require("./ErrorHandler.class");

const { generateToken } = require("./Extra.functions");
const user = require("../models/User.models");
require('dotenv').config()
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
            passReqToCallback: true
        },
        async function (req, accessToken, refreshToken, profile, done) {
            let data = req.query.state
            let { userType } = JSON.parse(data)
            let User = await user.findOne({ email: profile._json.email });
            try {
                // Check if the user already exists

                if (!User) {
                    // If the user doesn't exist, create a new user
                    let createuser = await user.create({
                        name: profile.displayName,
                        email: profile._json.email,
                        profile_picture: profile?._json.picture,
                        signUpBy: "Google", // Mark as signed up via Google,
                        token: null,
                        isEmailVerified: true,
                        userType
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
                if (User.userType !== userType.toLowerCase()) { return done(new ErrorHandler(404, "Profile Error! Cant Sign In")) }
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