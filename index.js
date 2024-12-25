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
app.use(cors())

const connectDB = require("./others/ConnectDB")
connectDB()

// passport 

const passport = require("passport");
const passportHandler = require("./others/Passport.setup")
app.use(passport.initialize())
passportHandler()

const { hashPassword, comparePassword } = require("./others/Extra.functions")

app.get("/", (req, res, next) => {

    res.send(`<a href="/auth/google">Login</a>`)
})
app.use('/auth/google', authRoute)
app.use('/api/user', userRouter)





// Function to get local IP address (non-127.0.0.1 IP)
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
     const completeURL = `http://${localIP}:${port}`;
     console.log('Complete url: ', completeURL);
})

app.use(ErrorMiddleware)