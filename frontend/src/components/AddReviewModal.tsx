import {  useState } from "react";
import { addReview, type AddReviewRequest } from "../services/reviewService";
import { toast } from "react-hot-toast";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  onSave?: () => void;
}

const AddReviewModal: FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  companyId,
  companyName,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    reviewText: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#FEE2E2",
        color: "#B91C1C",
        fontWeight: "500",
        borderRadius: "12px",
        border: "1px solid #FECACA",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      iconTheme: {
        primary: "#DC2626",
        secondary: "#fff",
      },
    });
  };

  const showSuccessToast = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: "top-center",
      style: {
        background: "#D1FAE5",
        color: "#065F46",
        fontWeight: "500",
        borderRadius: "12px",
        border: "1px solid #A7F3D0",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      iconTheme: {
        primary: "#059669",
        secondary: "#fff",
      },
    });
  };

  const handleSubmit = async () => {
    if (formData.rating === 0) {
      showErrorToast("Please select a rating");
      return;
    }

    if (!formData.fullName || !formData.subject || !formData.reviewText) {
      showErrorToast("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: AddReviewRequest = {
        companyId: companyId,
        fullName: formData.fullName,
        subject: formData.subject,
        reviewText: formData.reviewText,
        rating: formData.rating
      };

      const response = await addReview(reviewData);
      
      console.log("Review saved successfully:", response);
      
      setFormData({
        fullName: "",
        subject: "",
        reviewText: "",
        rating: 0,
      });
      
      if (onSave) {
        onSave();
      }
      
      onClose();
      
      showSuccessToast("Review submitted successfully! Thank you for your feedback.");
    } catch (error) {
      console.error("Error saving review:", error);
      showErrorToast("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className="text-3xl focus:outline-none transition-colors hover:scale-110 transform"
            disabled={isSubmitting}
          >
            <span
              className={
                star <= formData.rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600">
          {formData.rating > 0 ? (
            formData.rating === 5 ? "Excellent" :
            formData.rating === 4 ? "Satisfied" :
            formData.rating === 3 ? "Good" :
            formData.rating === 2 ? "Fair" :
            "Poor"
          ) : ""}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-xl border border-gray-200">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-purple-100 rounded-full -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-200 rounded-full translate-x-6 translate-y-6"></div>
        
        {/* Modal Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl font-light bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-center text-gray-800">Review {companyName}</h2>
          <p className="text-sm text-gray-500 text-center mt-1">Share your experience with others</p>
        </div>

        {/* Form */}
        <div className="px-6 py-4">
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Brief summary of your review"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              name="reviewText"
              value={formData.reviewText}
              onChange={handleInputChange}
              placeholder="Share details of your experience..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Rating */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            {renderStarRating()}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;