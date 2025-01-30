const CompanyModel = require('../models/Company.model')

exports.createCompany = async (req, res) => {
    try {
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
            aboutCompany: req.body.aboutCompany
        });
        const savedCompany = await company.save();
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