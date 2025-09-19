export interface Review {
  _id: string;
  company: string;
  fullName: string;
  subject: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  success: boolean;
  averageRating: string;
  count: number;
  data: Review[];
}

export interface AddReviewRequest {
  companyId: string;
  fullName: string;
  subject: string;
  reviewText: string;
  rating: number;
}

export interface AddReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}


const API_BASE = "http://localhost:5000/api";

// ✅ Get reviews by company ID
export const getReviewsByCompanyId = async (companyId: string): Promise<ReviewResponse> => {
  const response = await fetch(`${API_BASE}/reviews?companyId=${companyId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

export const addReview = async (reviewData: AddReviewRequest): Promise<AddReviewResponse> => {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error("Failed to add review");
  }

  return response.json();
};
