const { job, govtJobs } = require("../models/Jobs.model");
const user = require("../models/User.models");
const ErrorHandler = require("../others/ErrorHandler.class");
const mongoose = require("mongoose");


const createJob = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { jobPosition, workplace, location, company, type, salaryFrom = "Not Disclosed", salaryTo = "Not Disclosed", category, lastDate = "", description, qualification } = req?.body;

        if ([jobPosition, workplace, location, company, type, category, description].some(e => e.trim() === "")) {
            return next(new ErrorHandler(400, "jobPosition, workplace, location, company, type, category are required"));
        }
        if (typeof qualification !== "object") {
            return next(new ErrorHandler(400, "Only Array Allowed in Qualification"))
        }
        const findedUser = await user.findById(_id)
        if (category.toLowerCase() == "government" && !findedUser.isAdmin) return next(new ErrorHandler(400, "You cant post government job Only Staff Can!"))
        // if (salary !== "object") return next(new ErrorHandler(400, "Only Object Allowed"))


        const createJob = await job.create({ user: _id, jobPosition: jobPosition, jobWorkplace: workplace, jobLocation: location, company, jobType: type, description, lastDate, category, salaryFrom, salaryTo, qualification, description })

        res.status(201).json({ job: createJob, message: "Job pOSTED Successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const createGovtJobs = async (req, res, next) => {
    try {
        const { _id } = req.user
        if (!_id) return next(new ErrorHandler(404, "User Not Found! Token Error"))
        const { postName, qualification, totalNoOfPosts, department, officialLink, jobPostedOn = Date.now(), endDate, jobType, state } = req.body
        if (!postName) return next(new ErrorHandler(400, "Post Name Required!"))
        if (!qualification) return next(new ErrorHandler(400, "Qualification Required!"))
        if (!department) return next(new ErrorHandler(400, "You must have tell the Department!"))
        if (jobType.toLowerCase() == "state" && !state) return next(new ErrorHandler(400, "Please Provide which state vacancies it is."))
        if (!jobType) return next(new ErrorHandler(400, "You have tell is this a Central govt job or State Govt Job!"))

        await govtJobs.create({ createdBy: _id, postName, qualification, totalNoOfPosts, department, officialLink, jobPostedOn, endDate, jobType, state })

        res.status(201).json({ message: "Job created Successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
// filteration
const getJob = async (req, res, next) => {
    try {
        const { jobId, title, company, Location, status, salaryFrom, limit, page, workplace, category } = req?.query
        // console.log(typeof salaryFrom);
        let aggregatePipeline = []
        let skip = ((page - 1) * limit)
        if (limit > 30) {
            return next(new ErrorHandler(400, "Can't give more than 30 Jobs Data At Once It can Cause App Crash! Change the page to get more Data"))
        }
        if (jobId) {
            aggregatePipeline.push({
                $match: {
                    _id: new mongoose.Types.ObjectId(jobId)
                }
            })
        }
        if (workplace) {
            aggregatePipeline.push({
                $match: {
                    jobWorkplace: { $regex: workplace, $options: "i" }
                }
            })
        }
        if (category) {
            aggregatePipeline.push({
                $match: {
                    category: { $regex: category, $options: "i" }
                }
            })
        }
        if (title) {
            aggregatePipeline.push({
                $match: {
                    jobPosition: { $regex: title, $options: "i" }
                }
            })
        }
        if (company) {
            aggregatePipeline.push({
                $match: {
                    company: { $regex: company, $options: "i" }
                }
            })
        }
        if (Location) {
            aggregatePipeline.push({
                $match: {
                    jobLocation: { $regex: Location, $options: "i" }
                }
            })
        }
        if (status) {
            aggregatePipeline.push({
                $match: {
                    jobStatus: { $regex: status, $options: "i" }
                }
            })
        }
        if (salaryFrom) {
            aggregatePipeline.push({
                $match: {
                    salaryFrom: { $gte: salaryFrom }  // Correct usage of $gte inside $match
                }
            });
        }
        aggregatePipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [{
                        $project: {
                            fullName: 1,
                            email: 1,
                            profile_picture: 1,
                        }
                    }]
                },
            },)

        if (skip) {
            aggregatePipeline.push({
                $skip: Number(skip)
            })
        }
        if (limit) {
            aggregatePipeline.push({
                $limit: Number(limit)
            })
        }
        const findedJob = await job.aggregate(aggregatePipeline)
        // [
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(jobId)
        //         }
        //     }
        // ]
        res.send(findedJob)

    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const getGovtJob = async (req, res, next) => {
    try {
        const {
            id,
            postName,
            qualification,
            department,
            jobType,
            state,
            isActive,
            limit = 10
        } = req?.query;

        const pipiline = [];

        if (id) {
            pipiline.push({
                $match: {
                    _id: {
                        $regex: id, $options: 'i'
                    }
                }
            })
        }
        if (postName) {
            pipiline.push({
                $match: {
                    postName: {
                        $regex: postName, $options: 'i'
                    }
                }
            })
        }

        if (qualification) {
            pipiline.push({
                $match: {
                    qualification: {
                        $regex: qualification, $options: 'i'
                    }
                }
            })
        }

        if (department) {
            pipiline.push({
                $match: {
                    department: {
                        $regex: department, $options: 'i'
                    }
                }
            })
        }

        if (jobType) {
            pipiline.push({
                $match: {
                    jobType: {
                        $regex: jobType, $options: 'i'
                    }
                }
            })
        }

        if (state) {
            pipiline.push({
                $match: {
                    state: {
                        $regex: state, $options: 'i'
                    }
                }
            })
        }

        if (isActive === "true") {
            pipiline.push({
                $match: {
                    isActive: true
                }
            })
        }
        if (isActive === "false") {
            pipiline.push({
                $match: {
                    isActive: false
                }
            })
        }

        pipiline.push({ $limit: limit })
        const jobs = await govtJobs.aggregate(pipiline);

        res.json(jobs);
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}



const applicationApprovalList = async (req, res, next) => {
    try {
        const { email } = req.user
        const { limit, page } = req?.query
        let skip = (Number(page) - 1) * Number(limit)
        let pipeline = [{
            $match: {
                approval: "pending"
            }
        }]
        if (limit && page) {
            pipeline.push({ $skip: Number(skip) })
        }
        if (limit) {
            pipeline.push({ $limit: Number(limit) })
        }
        const listOfApplications = await user.aggregate(pipeline)
        res.send(listOfApplications)
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const userList = async (req, res, next) => {
    try {
        const { page, limit = 20, name, email, userType, isEmailVerified, isAdmin, userStatus } = req?.query
        // console.log(userStatus);
        let skip = (page - 1) * limit

        let pipeline = []

        if (name) {
            pipeline.push({
                $match: {
                    fullName: { $regex: name, $options: "i" }
                }
            })
        }

        if (email) {
            pipeline.push({
                $match: {
                    email: { $regex: email, $options: "i" }
                }
            })
        }
        if (userType) {
            pipeline.push({
                $match: {
                    userType: { $regex: userType, $options: "i" }
                }
            })
        }
        if (isEmailVerified && isEmailVerified !== "undefined") {
            pipeline.push({
                $match: {
                    isEmailVerified: true
                }
            })
        }
        if (isAdmin && isAdmin !== "undefined") {
            pipeline.push({
                $match: {
                    isAdmin: true
                }
            })
        }
        if (userStatus == "true") {
            pipeline.push({
                $match: {
                    isBlocked: true
                }
            })
        }
        if (userStatus == "false") {
            pipeline.push({
                $match: {
                    isBlocked: false
                }
            })
        }
        if (limit) {
            pipeline.push({
                $limit: Number(limit)
            })
        }

        if (limit && page) {
            pipeline.push({
                $skip: Number(skip)
            })
        }

        const findUser = await user.aggregate(pipeline)
        res.status(200).json({ users: findUser })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const jobsPerMonth = async (req, res, next) => {
    try {
        const alljobs = await job.aggregate([
            {
                $addFields: {
                    createdAt: { $toDate: "$createdAt" } // Convert to Date if it's a timestamp
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    jobCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // console.log(alljobs);
        res.send(alljobs)

    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const jobsPerDay = async (req, res, next) => {
    try {
        const dayStart = new Date()
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date()
        dayEnd.setHours(23, 59, 59, 999)

        const jobs = await job.countDocuments({
            createdAt: { $gte: dayStart, $lt: dayEnd }
        })
        res.send({ count: jobs })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const ActivejobsPerDay = async (req, res, next) => {
    try {

        const jobs = await job.find({ jobStatus: "active" })
        res.send(jobs)
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const deleteJobById = async (req, res, next) => {
    try {
        const { jobid } = req.query
        if (!jobid) return next(new ErrorHandler(404, "User ID not found!"))
        const findAndDlt = await job.findByIdAndDelete(jobid)
        res.status(200).json({ message: "Deleted SuccessFully" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const deleteGovtJobById = async (req, res, next) => {
    try {
        const { jobid } = req.query
        if (!jobid) return next(new ErrorHandler(404, "User ID not found!"))
        const findAndDlt = await govtJobs.findByIdAndDelete(jobid)
        res.status(200).json({ message: "Deleted SuccessFully" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}
const activeInactiveGovtJob = async (req, res, next) => {
    try {
        const { jobid, isActive } = req.query
        if (!jobid) return next(new ErrorHandler(404, "User ID not found!"))
        const findAndDlt = await govtJobs.findByIdAndUpdate(jobid, { isActive }, { new: true })
        res.status(200).json({ message: "Updated SuccessFully" })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

const totalNumberOfActiveJobs = async (req, res, next) => {  // only private,ngo, freelance jobs
    try {

        const countJobs = await job.aggregate([
            {
                $match: {
                    jobStatus: "active"
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ])

        const countGovtJobs = await govtJobs.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $group: {
                    _id: "govt",
                    count: { $sum: 1 }
                }
            },

        ])
        res.status(200).send([...countJobs, ...countGovtJobs])
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


module.exports = { createJob, getJob, applicationApprovalList, userList, jobsPerMonth, jobsPerDay, ActivejobsPerDay, deleteJobById, createGovtJobs, getGovtJob, deleteGovtJobById, activeInactiveGovtJob, totalNumberOfActiveJobs }