const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function hashPassword(password) {
    const hashedPass = await bcrypt.hash(password, 10)
    return hashedPass
}

async function comparePassword(password, hashedPassword) {
    const isEqual = await bcrypt.compare(password, hashedPassword)
    return isEqual
}


async function generateToken(payload, secret) {
    const generateToken = await jwt.sign(payload, secret, { expiresIn: "7d" })
    return generateToken
}

async function verifyToken(payload, secret) {
    const verify = await jwt.verify(payload, secret)
    return verify
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken }