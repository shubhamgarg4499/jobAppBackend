const express = require('express')
const { createJob, getJob, applicationApprovalList } = require('../controllers/Jobs.controller')
const verifyTokenMiddleware = require('../middleswares/verifyJWT.middlewares')
const jobRouter = express.Router()

jobRouter.route("/createJob").post(verifyTokenMiddleware, createJob)
jobRouter.route("/getJob").post(getJob)
jobRouter.route("/getapprovallist").post(applicationApprovalList)

module.exports = jobRouter