const express = require('express');
const {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    addEmployer
} = require('../controllers/Company.controller');

const verifyTokenMiddleware = require('../middleswares/verifyJWT.middlewares');
const isAdmin = require('../middleswares/isAdmin');
const isVerifiedEmployer = require('../middleswares/isVerifiedEmployer');
const { uploadLogo, upload } = require('../middleswares/imageUpload.middleware');

const companyRouter = express.Router();

// Create a new company
companyRouter.post('/create', verifyTokenMiddleware, isVerifiedEmployer,  upload.single("logo"), uploadLogo, createCompany);

// Get all companies
companyRouter.get('/listall', verifyTokenMiddleware, getAllCompanies);

// Get a specific company by ID
companyRouter.get('/list/:id', verifyTokenMiddleware, getCompanyById);

// Update company details
companyRouter.put('/update/:id', verifyTokenMiddleware, updateCompany);

// Delete a company
companyRouter.delete('/delete/:id', verifyTokenMiddleware, isAdmin, deleteCompany);

// Add Employer
companyRouter.patch('/addEmployer/:id', verifyTokenMiddleware, isAdmin, addEmployer);

module.exports = companyRouter;