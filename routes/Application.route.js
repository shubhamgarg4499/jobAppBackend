const express = require("express");
const router = express.Router();
const { createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication, shortlistApplication, hireApplication } = require("../controllers/Application.controller");

router.post("/create", createApplication);
router.get("/listall", getAllApplications);
router.get("/detailone/:id", getApplicationById);
router.put("/update/:id", updateApplication);
router.delete("/delete/:id", deleteApplication);
router.post("/shortlist/:id", shortlistApplication);
router.post("/hire/:id", hireApplication);

module.exports = router;