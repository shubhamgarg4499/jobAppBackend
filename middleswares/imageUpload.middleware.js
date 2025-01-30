const multer = require("multer");
const fs = require("fs");
const ErrorHandler = require("../others/ErrorHandler.class");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadLogo = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filePath = req.file.path;

    try {
        const file = fs.readFileSync(filePath);
        const base64Image = file.toString("base64");

        req.body.logo = `data:${req.file.mimetype};base64,${base64Image}`;

        fs.unlinkSync(filePath);

        next();
    } catch (error) {
        return next(new ErrorHandler(500, "Failed to process the uploaded file."));
    }
};

exports.upload = upload;