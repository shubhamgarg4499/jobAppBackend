const express = require("express")
const ErrorMiddleware = require("./middleswares/Error.middleware")
const ErrorHandler = require("./others/ErrorHandler.class")
const app = express()
app.use(express.json())
require("dotenv").config()
const port = process.env.PORT || 5000
const cors = require("cors")
app.use(cors())

const connectDB = require("./others/ConnectDB")
connectDB()

// passport 

const passport = require("passport");
const passportHandler = require("./others/Passport.setup")
app.use(passport.initialize())
passportHandler()



app.get("/", (req, res, next) => {

    res.send(`<a href="/auth/google">Login</a>`)
})


// google auth routes
const authRoute = require("./routes/GoogleAuth.routes")
app.use('/auth/google', authRoute)

// user routes
const userRouter = require("./routes/UserProfile.routes")
app.use('/api/user', userRouter)




app.listen(port, () => {
    console.log(port);
})

app.use(ErrorMiddleware)