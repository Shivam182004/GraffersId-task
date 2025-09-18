const Company = require("../models/Company");
const Review = require("../models/Review");

// @desc List companies with review count & average rating
exports.getCompanies = async (req, res) => {
  try {
    const { search, city } = req.query;

    let query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (city) query.city = city;

    const companies = await Company.find(query).sort({ createdAt: -1 });

    // Attach review stats for each company
    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const reviews = await Review.find({ company: company._id });

        const reviewCount = reviews.length;
        const averageRating =
          reviewCount > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
            : 0;

        return {
          ...company.toObject(),
          reviewCount,
          averageRating: Number(averageRating.toFixed(1)),
        };
      })
    );

    res.json({
      success: true,
      count: companiesWithStats.length,
      data: companiesWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add new company
exports.addCompany = async (req, res) => {
  try {
    const { name, location, foundedOn, city, logo, description } = req.body;

    const company = await Company.create({
      name,
      location,
      foundedOn,
      city,
      logo,
      description,
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc List companies with search & filter
// exports.getCompanies = async (req, res) => {
//   try {
//     const { search, city } = req.query;

//     let query = {};
//     if (search) query.name = { $regex: search, $options: "i" };
//     if (city) query.city = city;

//     const companies = await Company.find(query).sort({ createdAt: -1 });

//     res.json({ success: true, count: companies.length, data: companies });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
