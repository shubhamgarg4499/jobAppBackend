const CompanyModel = require('../models/Company.model');
const { job } = require('../models/Jobs.model');
const user = require('../models/User.models');
const ErrorHandler = require('../others/ErrorHandler.class');

exports.createCompany = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const userId = _id.toString();

        const company = new CompanyModel({
            name: req.body.name,
            industry: req.body.industry,
            mail: req.body.mail,
            ceoName: req.body.ceoName,
            number: req.body.number,
            website: req.body.website,
            size: req.body.size,
            foundedIn: req.body.foundedIn,
            location: req.body.location,
            gstNumber: req.body.gstNumber,
            logo: req.body.logo,
            aboutCompany: req.body.aboutCompany,
            employer: userId
        });
        const savedCompany = await company.save();

        if (savedCompany) {
            const updatedUser = await user.findByIdAndUpdate(
                
                _id,
                { hasCompany: true },  // Update the `hasCompany` field to true
                { new: true }  // Return the updated user document (optional)
            );

            res.status(201).json({
                message: "Company created successfully and user updated",
                company: savedCompany,
                user: updatedUser
            });
        }

        res.status(201).json(savedCompany);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyModel.find();
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await CompanyModel.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update 
exports.getCompanyJobs = async (req, res) => {
    try {
        const company = await CompanyModel.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const jobs = await job.find({ company: company._id });

        if (jobs.length === 0) {
            return res.status(404).json({ error: 'No jobs found for this company' });
        }

        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCurrentEmployerCompany = async (req, res) => {
    try {
        const { _id } = req.user;
        const userId = _id.toString();

        const companies = await CompanyModel.find({
            employers: { $in: [userId] }
        })
        // .populate('employers') 

        if (!companies.length) {
            return (new ErrorHandler(404, "No companies found where you are an employer"));
        }

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update company details
exports.updateCompany = async (req, res) => {
    try {
        const updatedCompany = await CompanyModel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                industry: req.body.industry,
                mail: req.body.mail,
                ceoName: req.body.ceoName,
                number: req.body.number,
                website: req.body.website,
                size: req.body.size,
                foundedIn: req.body.foundedIn,
                location: req.body.location,
                gstNumber: req.body.gstNumber
            },
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json(updatedCompany);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
    try {
        const deletedCompany = await CompanyModel.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addEmployer = async (req, res) => {
    try {
        const { id } = req.params;
        const { employer } = req.body;

        // $addToSet to add the employer 
        const updatedCompany = await CompanyModel.findByIdAndUpdate(
            id,
            { $addToSet: { employers: employer } },
            { new: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.status(200).json({ message: 'Employer added successfully', data: updatedCompany });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};