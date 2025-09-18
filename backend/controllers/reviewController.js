const Review = require("../models/Review");
const Company = require("../models/Company");

// @desc Add review
exports.addReview = async (req, res) => {
  try {
    const { companyId, fullName, subject, reviewText, rating } = req.body;

    const review = await Review.create({
      company: companyId,
      fullName,
      subject,
      reviewText,
      rating,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc List reviews for a company + average rating
exports.getReviews = async (req, res) => {
  try {
    const { companyId, sort } = req.query;

    let reviews = await Review.find({ company: companyId }).sort(
      sort === "date"
        ? { createdAt: -1 }
        : sort === "rating"
        ? { rating: -1 }
        : {}
    );

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    res.json({
      success: true,
      averageRating: avgRating.toFixed(1),
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
