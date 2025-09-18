const express = require("express");
const { addReview, getReviews } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", addReview); // Add review
router.get("/", getReviews); // Get reviews

module.exports = router;
