const express = require("express")
const os = require('os');
const ErrorMiddleware = require("./middleswares/Error.middleware")
const ErrorHandler = require("./others/ErrorHandler.class")
// google auth routes
const authRoute = require("./routes/GoogleAuth.routes")
// user routes
const userRouter = require("./routes/UserProfile.routes")
const app = express()
app.use(express.json())
require("dotenv").config()
//console.log('process env::::::; ',process.env);

const cors = require("cors")
app.use(cors({
    // https://jobappdashboard.netlify.app/
    origin: ['http://localhost:5173', "https://jobappdashboard.netlify.app"], // Allow your React app
    credentials: true,
}))
const connectDB = require("./others/ConnectDB")
connectDB()

// passport 

const passport = require("passport"); ``
const passportHandler = require("./others/Passport.setup")
app.use(passport.initialize())
passportHandler()

const { hashPassword, comparePassword } = require("./others/Extra.functions")

app.get("/", (req, res, next) => {
    res.send(`<a href="/auth/google?userType=employer">Login</a>`)
})
app.use('/auth/google', authRoute)

// user routes
const userRouter = require("./routes/User.routes")
app.use('/api/user', userRouter)

// job routes
const jobRouter = require("./routes/Job.routes")
app.use("/api/job", jobRouter)

// company routes
const companyRouter = require("./routes/Company.routes")
app.use("/api/company", companyRouter)

// post routes
const postRouter = require("./routes/Post.routes")
app.use("/api/post", postRouter)

// application routes
const applicationRouter = require("./routes/Application.route")
app.use("/api/application", applicationRouter)

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            // Check if the interface is an IPv4 address and not a loopback
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback to localhost
}

// Get the local IP address
const localIP = getLocalIPAddress();
const port = process.env.PORT || 5000
app.listen(port, () => {
    // Complete URL (protocol + IP address + port)
    // const completeURL = `http://${localIP}:${port}`;
    // console.log('Complete url: ', completeURL);
    console.log(`Server running on: http://localhost:${port}`)
})

app.use(ErrorMiddleware)