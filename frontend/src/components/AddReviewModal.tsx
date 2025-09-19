import { FC, useState } from "react";
import { addReview, type AddReviewRequest } from "../services/reviewService"; // Import the service

// Props for the modal
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle star rating click
  const handleStarClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!formData.fullName || !formData.subject || !formData.reviewText) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the review data object
      const reviewData: AddReviewRequest = {
        companyId: companyId,
        fullName: formData.fullName,
        subject: formData.subject,
        reviewText: formData.reviewText,
        rating: formData.rating
      };

      // Call the API to save the review
      const response = await addReview(reviewData);
      
      console.log("Review saved successfully:", response);
      
      // Reset form
      setFormData({
        fullName: "",
        subject: "",
        reviewText: "",
        rating: 0,
      });
      
      // Call onSave callback to refresh data
      if (onSave) {
        onSave();
      }
      
      // Close modal
      onClose();
      
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-600 rounded-full -translate-x-8 -translate-y-8"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-300 rounded-full translate-x-6 -translate-y-6"></div>
        
        {/* Modal Header */}
        <div className="relative p-6 pb-0">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-light"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-center mb-6 pt-4">Add Review for {companyName}</h2>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Enter review subject"
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Enter your Review</label>
            <textarea
              name="reviewText"
              value={formData.reviewText}
              onChange={handleInputChange}
              placeholder="Write your review here..."
              rows={4}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-3">Rating</label>
            {renderStarRating()}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;