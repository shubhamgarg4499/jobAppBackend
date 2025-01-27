const Application = require("../models/Application.model");

exports.createApplication = async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json({ message: "Application submitted successfully.", id: application._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit application.", details: error.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const filters = req.query;
        const applications = await Application.find(filters);
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch applications.", details: error.message });
    }
};

exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ error: "Application not found." });
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch application.", details: error.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!application) return res.status(404).json({ error: "Application not found." });
        res.status(200).json({ message: "Application updated successfully.", application });
    } catch (error) {
        res.status(500).json({ error: "Failed to update application.", details: error.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) return res.status(404).json({ error: "Application not found." });
        res.status(200).json({ message: "Application deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete application.", details: error.message });
    }
};

exports.shortlistApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, { shortlisted: true }, { new: true });
        if (!application) return res.status(404).json({ error: "Application not found." });
        res.status(200).json({ message: "Application shortlisted successfully.", application });
    } catch (error) {
        res.status(500).json({ error: "Failed to shortlist application.", details: error.message });
    }
};

exports.hireApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, { hired: true }, { new: true });
        if (!application) return res.status(404).json({ error: "Application not found." });
        res.status(200).json({ message: "Application marked as hired.", application });
    } catch (error) {
        res.status(500).json({ error: "Failed to mark application as hired.", details: error.message });
    }
};
