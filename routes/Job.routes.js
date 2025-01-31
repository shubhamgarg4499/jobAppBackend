const express = require('express')
const { createJob, getJob, applicationApprovalList, jobsPerMonth, jobsPerDay, ActivejobsPerDay, deleteJobById, createGovtJobs, getGovtJob, deleteGovtJobById, activeInactiveGovtJob, totalNumberOfActiveJobs, getAllApplications } = require('../controllers/Jobs.controller')
const isAdmin = require('../middleswares/isAdmin')
const verifyTokenMiddleware = require('../middleswares/verifyJWT.middlewares')
const { isAuthorizedEmployer } = require('../middleswares/isAuthorizedEmployer.middleware')
const jobRouter = express.Router()

jobRouter.route("/createJob").post(verifyTokenMiddleware, isAuthorizedEmployer, createJob)
jobRouter.route("/getJob").get(verifyTokenMiddleware, getJob)
jobRouter.route("/govt-jobs").get(verifyTokenMiddleware, getGovtJob)

jobRouter.route("/getapprovallist").get(verifyTokenMiddleware, isAdmin, applicationApprovalList)
jobRouter.route("/jobspermonth").post(verifyTokenMiddleware, isAdmin, jobsPerMonth)
jobRouter.route("/jobsperday").post(verifyTokenMiddleware, isAdmin, jobsPerDay)
jobRouter.route("/activejobsperday").post(verifyTokenMiddleware, isAdmin, ActivejobsPerDay)
jobRouter.route("/deletejobbyid").delete(verifyTokenMiddleware, isAdmin, deleteJobById)
jobRouter.route("/deletegovtjobbyid").delete(verifyTokenMiddleware, isAdmin, deleteGovtJobById)
jobRouter.route("/activeinactivegovtjob").post(verifyTokenMiddleware, isAdmin, activeInactiveGovtJob)
jobRouter.route("/creategovtjobs").post(verifyTokenMiddleware, isAdmin, createGovtJobs)
jobRouter.route("/totalNumberOfActiveJobs").get(verifyTokenMiddleware, totalNumberOfActiveJobs)

jobRouter.route("/getApplications/:jobId").get(verifyTokenMiddleware, getAllApplications)


module.exports = jobRouter