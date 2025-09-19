import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AddCompanyModal from "../components/AddCompanyModal";
import { getAllCompanies } from "../services/companyService";

interface Company {
  _id: string;
  name: string;
  location: string;
  city: string;
  foundedOn: string;
  description: string;
  logo: string;
  averageRating?: number;
  reviewCount?: number;
}

// Sorting options
type SortOption = "name" | "rating" | "reviews";

const HomePage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState(""); // city input from user
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // fetch with optional city
  const fetchCompanies = async (cityFilter?: string) => {
    try {
      // clean: trim spaces & lowercase
      const cleanCity = cityFilter?.trim().toLowerCase() || "";
      const queryParam = cleanCity ? `?city=${encodeURIComponent(cleanCity)}` : "";
      const data = await getAllCompanies(queryParam);
      setCompanies(data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleOpenReviewDetails = (company: Company) => {
    navigate(`/reviews/${company._id}`);
  };

  useEffect(() => {
    fetchCompanies(); // load all initially
  }, []);

  const handleRefresh = () => {
    fetchCompanies(city);
  };

  // Sort companies based on selected option and direction
  const sortedCompanies = [...companies].sort((a, b) => {
    switch (sortOption) {
      case "name":
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);

      case "rating":
        const ratingA = a.averageRating || 0;
        const ratingB = b.averageRating || 0;
        return sortDirection === "desc" ? ratingB - ratingA : ratingA - ratingB;

      case "reviews":
        const reviewsA = a.reviewCount || 0;
        const reviewsB = b.reviewCount || 0;
        return sortDirection === "desc" ? reviewsB - reviewsA : reviewsA - reviewsB;

      default:
        return 0;
    }
  });

  const handleSortChange = (option: SortOption) => {
    if (option === sortOption) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection(option === "name" ? "asc" : "desc");
    }
  };

  const renderStars = (rating: number) => {
    if (isNaN(rating)) rating = 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <span key={i} className="text-yellow-400 text-sm">
                ★
              </span>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <span key={i} className="text-yellow-400 text-sm">
                ★
              </span>
            );
          } else {
            return (
              <span key={i} className="text-gray-300 text-sm">
                ★
              </span>
            );
          }
        })}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Container */}
      <div className="w-4/5 mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Enter City</span>
          </div>

          <div className="flex items-center gap-4">
            {/* City Input */}
            <input
              type="text"
              placeholder="Type city name..."
              value={city}
              onChange={(e) => setCity(e.target.value.trimStart())} // prevent leading spaces
              className="border border-gray-300 rounded-md px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[250px]"
            />

            {/* Find Company Button */}
            <button
              className="px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              onClick={() => fetchCompanies(city)}
            >
              Find Company
            </button>

            {/* Add Company Button */}
            <button
              className="px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
              onClick={() => setIsAddCompanyModalOpen(true)}
            >
              + Add Company
            </button>

            {/* Sort Dropdown */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
              >
                <option value="name">
                  Name {sortOption === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </option>
                <option value="rating">
                  Rating {sortOption === "rating" && (sortDirection === "desc" ? "↑" : "↓")}
                </option>
                <option value="reviews">
                  Reviews {sortOption === "reviews" && (sortDirection === "desc" ? "↑" : "↓")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-600">
            Result Found: {companies.length}
          </h3>
        </div>

        {/* Company Listings */}
        <div className="space-y-4">
          {sortedCompanies.map((company) => (
            <div
              key={company._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-22 h-22 object-contain rounded-lg border border-gray-200"
                  />
                </div>

                {/* Company Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {company.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {company.location}, {company.city}
                      </div>

                      <div className="flex items-center gap-4">
                        {renderStars(Number(company.averageRating) || 0)}
                        {(company.reviewCount ?? 0) > 0 && (
                          <span className="text-sm text-gray-600">
                            {company.reviewCount} Reviews
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col items-end gap-4">
                      <p className="text-xs text-gray-500">
                        Founded on{" "}
                        {new Date(company.foundedOn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>

                      <button
                        className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition-colors font-medium text-sm"
                        onClick={() => handleOpenReviewDetails(company)}
                      >
                        Detail Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onSave={handleRefresh}
      />
    </div>
  );
};

export default HomePage;
