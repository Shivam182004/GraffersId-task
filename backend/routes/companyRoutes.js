const express = require("express");
const { addCompany, getCompanies, getCompanyById } = require("../controllers/companyController");
const upload = require("../middlewares/upload.js");

const router = express.Router();

router.post("/", addCompany); // Add company
router.post("/upload", upload.single("logo"), addCompany); // Add company
router.get("/", getCompanies); // List companies
router.get("/:id", getCompanyById);

module.exports = router;
