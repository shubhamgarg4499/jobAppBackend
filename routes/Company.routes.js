const express = require('express');
const {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require('../controllers/Company.controller');

const verifyTokenMiddleware = require('../middleswares/verifyJWT.middlewares');
const isAdmin = require('../middleswares/isAdmin');

const companyRouter = express.Router();

// Create a new company
companyRouter.post('/create', verifyTokenMiddleware, isAdmin, createCompany);

// Get all companies
companyRouter.get('/listall', verifyTokenMiddleware, getAllCompanies);

// Get a specific company by ID
companyRouter.get('/list/:id', verifyTokenMiddleware, getCompanyById);

// Update company details
companyRouter.put('/update/:id', verifyTokenMiddleware, isAdmin, updateCompany);

// Delete a company
companyRouter.delete('/delete/:id', verifyTokenMiddleware, isAdmin, deleteCompany);

module.exports = companyRouter;