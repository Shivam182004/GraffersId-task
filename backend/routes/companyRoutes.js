const express = require("express");
const { addCompany, getCompanies } = require("../controllers/companyController");

const router = express.Router();

router.post("/", addCompany); // Add company
router.get("/", getCompanies); // List companies

module.exports = router;
