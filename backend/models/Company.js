const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    foundedOn: { type: Date, required: true },
    city: { type: String, required: true },
    logo: { type: String }, // Optional
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
