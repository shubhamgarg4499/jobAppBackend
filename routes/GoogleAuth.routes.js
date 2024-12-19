const express = require("express");
const passport = require("passport");
const user = require("../models/User.models");
// const isAuthenticated = require("../middlewares/isAuthenticated");
// const verifyToken = require("../middlewares/verifyJWT.middlewares");

// const isAuthenticated = require("../middlewares/isAuthenticated");
const authRoute = express.Router()


// google login
authRoute.route('/').get(passport.authenticate('google', { scope: ["profile", "email"], session: false }));


authRoute.route('/callback').get(passport.authenticate('google', { failureRedirect: '/', session: false }), (req, res) => {
    // res.send("done")
    res.json({ user: req.user, success: true, token: req?.user?.token }); // Send token in the response
})

module.exports = authRoute