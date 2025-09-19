import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getCompanyById } from "../services/companyService";
import { getReviewsByCompanyId } from "../services/reviewService";
import AddReviewModal from "../components/AddReviewModal";

// Company type (matches backend API response)
interface Company {
  _id: string;
  name: string;
  location: string;
  city: string;
  foundedOn: string;
  description: string;
  logo: string;
  avgRating?: number;
  reviewCount?: number;
}

// Review type based on the actual API response
interface Review {
  _id: string;
  company: string;
  fullName: string;
  subject: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Review API response type
interface ReviewResponse {
  success: boolean;
  averageRating: string;
  count: number;
  data: Review[];
}

const ReviewPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  // function to open modal
  const openAddReviewModal = () => setIsAddReviewOpen(true);

  // function to close modal
  const closeAddReviewModal = () => setIsAddReviewOpen(false);

  // function to refresh reviews after adding a new review
  const handleReviewAdded = () => {
    if (companyId) fetchReviews(companyId);
    closeAddReviewModal();
  };

  // Function to fetch company details
  const fetchCompany = async (id: string) => {
    try {
      const data = await getCompanyById(id);
      setCompany(data.data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  // Function to fetch reviews for a company
  const fetchReviews = async (id: string) => {
    try {
      const data: ReviewResponse = await getReviewsByCompanyId(id);
      setReviews(data.data);
      setAverageRating(parseFloat(data.averageRating));
      setReviewCount(data.count);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId);
      fetchReviews(companyId);
    }
  }, [companyId]);

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <span key={i} className="text-yellow-400 text-lg">
                ★
              </span>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <span key={i} className="text-yellow-400 text-lg">
                ★
              </span>
            );
          } else {
            return (
              <span key={i} className="text-gray-300 text-lg">
                ★
              </span>
            );
          }
        })}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}, ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="w-4/5 mx-auto px-6 py-8">
          <div className="text-center">Loading company details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Container - 80% width */}
      <div className="w-4/5 mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Companies
        </button>

        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {company.name}
                </h1>
                <p className="text-gray-600 mb-4 flex items-center">
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
                </p>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">
                      {averageRating.toFixed(1)}
                    </span>
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-blue-600 font-medium">
                    {reviewCount} Reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-4">
                Founded on{" "}
                {new Date(company.foundedOn).toLocaleDateString("en-GB")}
              </p>
              <button
                onClick={openAddReviewModal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                + Add Review
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Result Found: <span className="font-semibold">{reviewCount}</span>
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-pulse">Loading reviews...</div>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold text-lg">
                      {review.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {review.fullName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="mb-3">{renderStars(review.rating)}</div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {review.subject}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-lg">No reviews yet.</p>
                <p className="text-sm mt-2">
                  Be the first to share your experience!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewOpen}
        companyId={companyId!}
        companyName={company?.name || ""}
        onClose={closeAddReviewModal}
        onSave={handleReviewAdded}
      />
    </div>
  );
};

export default ReviewPage;
