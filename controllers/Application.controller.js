const Application = require("../models/Application.model");
const ErrorHandler = require("../others/ErrorHandler.class");

const handleApplicationNotFound = (next) => {
    return next(new ErrorHandler(404, "Application not found."));
};

// Create a new application
exports.createApplication = async (req, res, next) => {
    try {
        const { jobid, user, role, cover_letter, notes } = req.body;

        if (!jobid || !user || !role) {
            return next(new ErrorHandler(400, "jobid, user, and role are required."));
        }

        const application = new Application({
            jobid,
            user,
            role,
            cover_letter,
            notes,
        });

        await application.save();
        res.status(201).json({ message: "Application submitted successfully.", id: application._id });
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get all applications with optional filters and pagination
exports.getAllApplications = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;

        const applications = await Application.find(filters)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Application.countDocuments(filters);

        res.status(200).json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            applications,
        });
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get a single application by ID
exports.getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return handleApplicationNotFound(next);
        res.status(200).json(application);
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Update an application
exports.updateApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const application = await Application.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!application) return handleApplicationNotFound(next);

        res.status(200).json({ message: "Application updated successfully.", application });
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Delete an application
exports.deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findByIdAndDelete(id);
        if (!application) return handleApplicationNotFound(next);

        res.status(200).json({ message: "Application deleted successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Shortlist an application
exports.shortlistApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findByIdAndUpdate(
            id,
            { status: "Shortlisted" },
            { new: true }
        );

        if (!application) return handleApplicationNotFound(next);

        res.status(200).json({ message: "Application shortlisted successfully.", application });
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Mark an application as hired
exports.hireApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findByIdAndUpdate(
            id,
            { status: "Hired" },
            { new: true }
        );

        if (!application) return handleApplicationNotFound(next);

        res.status(200).json({ message: "Application marked as hired.", application });
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
};