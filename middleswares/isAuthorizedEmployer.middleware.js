const Company = require("../models/Company.model");
const ErrorHandler = require("../others/ErrorHandler.class");

exports.isAuthorizedEmployer = async (req, res, next) => {
    const postedBy = req.user._id.toString();
    const company  = req.body.company;
    // console.log(company)
    const companyDoc = await Company.findById(company);
    if (!companyDoc) {
        return next(new ErrorHandler(404, "Company not found."));
    }
    
    // Check if the user is an employer for the company
    if (
        !companyDoc.employers.includes(postedBy)
    ) {
        return next(new ErrorHandler(403, "You are not authorized to post jobs for this company."));
    }

    next();
};