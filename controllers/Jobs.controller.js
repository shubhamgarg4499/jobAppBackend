const { job } = require("../models/Jobs.model");
const user = require("../models/User.models");
const ErrorHandler = require("../others/ErrorHandler.class");
const mongoose = require("mongoose");
const createJob = async (req, res, next) => {
    try {
        const { _id } = req.user
        const { jobPosition, workplace, location, company, type, salaryFrom = "Not Disclosed", salaryTo = "Not Disclosed", category, lastDate = "", description, qualification } = req?.body;

        if ([jobPosition, workplace, location, company, type, category, description].some(e => e.trim() === "")) {
            return next(new ErrorHandler(400, "jobPosition, workplace, location, company, type, salary, category are required"));
        }
        if (typeof qualification !== "object") {
            return next(new ErrorHandler(400, "Only Array Allowed in Qualification"))
        }
        const findedUser = await user.findById(_id)
        if (category.toLowerCase() == "government" && !findedUser.isAdmin) return next(new ErrorHandler(400, "You cant post government job Only App Staffs Can"))
        // if (salary !== "object") return next(new ErrorHandler(400, "Only Object Allowed"))


        const createJob = await job.create({ user: _id, jobPosition: jobPosition, jobWorkplace: workplace, jobLocation: location, company, jobType: type, description, lastDate, category, salaryFrom, salaryTo, qualification, description })

        res.status(201).json({ job: createJob, message: "Job pOSTED Successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}

// filteration
const getJob = async (req, res, next) => {
    try {
        const { jobId, title, company, Location, Status, salaryFrom, limit, page, workplace } = req?.query
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
        if (Status) {
            aggregatePipeline.push({
                $match: {
                    jobStatus: { $regex: Status, $options: "i" }
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
        const findJob = await job.aggregate(aggregatePipeline)
        // [
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(jobId)
        //         }
        //     }
        // ]
        res.send(findJob)

    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


const applicationApprovalList = async (req, res, next) => {
    try {
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
        const { page, limit, name, email, profile } = req?.query

        let skip = (page - 1) * limit

        let pipeline = []

        if (name) {
            pipeline.push({
                $match: {
                    fullName: { $regex: name, $options: "i" }
                }
            })
        }


    } catch (error) {
        return next(new ErrorHandler(error.status, error.message))
    }
}


module.exports = { createJob, getJob, applicationApprovalList }