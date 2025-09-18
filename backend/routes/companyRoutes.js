const express = require("express");
const { addCompany, getCompanies } = require("../controllers/companyController");
const upload = require("../middlewares/upload.js");

const router = express.Router();

router.post("/", addCompany); // Add company
router.post("/upload", upload.single("logo"), addCompany); // Add company
router.get("/", getCompanies); // List companies

module.exports = router;
