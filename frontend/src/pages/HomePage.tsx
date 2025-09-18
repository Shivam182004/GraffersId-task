import { useEffect, useState } from "react";
import Header from "../components/Header";
import AddCompanyModal from "../components/AddCompanyModal";
import { getAllCompanies } from "../services/companyService";

// Company type (matches backend API response)
interface Company {
  _id: string;
  name: string;
  location: string;
  city: string;
  foundedOn: string;
  description: string;
  logo: string; // Cloudinary URL
  avgRating?: number;
  reviewCount?: number;
}

const HomePage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(
    "Indore, Madhya Pradesh, India"
  );
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);

  // Function to fetch companies from backend
  const fetchCompanies = async () => {
    try {
      const data = await getAllCompanies();
      setCompanies(data.data); // backend should return { success, data: [...] }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Fetch companies on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Refresh handler passed to modal
  const handleRefresh = () => {
    fetchCompanies();
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <span key={i} className="text-yellow-500">
                ★
              </span>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <span key={i} className="text-yellow-500">
                ★
              </span>
            );
          } else {
            return (
              <span key={i} className="text-gray-300">
                ★
              </span>
            );
          }
        })}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header Section */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container mx-auto px-4 py-6">
        {/* City Selection */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="Indore, Madhya Pradesh, India">
              Indore, Madhya Pradesh, India
            </option>
          </select>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Find Company
          </button>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            onClick={() => setIsAddCompanyModalOpen(true)}
          >
            + Add Company
          </button>

          <div className="ml-auto flex items-center">
            <span className="mr-2">Sort:</span>
            <select className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Name</option>
              <option>Rating</option>
              <option>Reviews</option>
            </select>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Results Header */}
        <div className="my-6">
          <h3 className="text-md font-medium">
            Result Found: {companies.length}
          </h3>
        </div>

        {/* Company Listings */}
        <div className="space-y-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start"
            >
              {/* Company Logo */}
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 object-contain rounded-md border mr-4"
              />

              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {company.location}, {company.city}
                    </p>

                    <div className="mt-3 flex items-center">
                      {renderStars(company.avgRating || 0)}
                      {company.reviewCount && (
                        <span className="ml-2 text-sm text-gray-500">
                          {company.reviewCount} Reviews
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 text-right">
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-md shadow hover:bg-gray-900">
                      Detail Review
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Founded on{" "}
                      {new Date(company.foundedOn).toLocaleDateString("en-GB")}
                    </p>
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
        onSave={handleRefresh} // refreshes company list after save
      />
    </div>
  );
};

export default HomePage;
