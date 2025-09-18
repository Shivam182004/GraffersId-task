

export interface CompanyFormData {
  name: string;
  location: string;
  foundedOn: string;
  city: string;
  description: string;
  logo: File | null;
}

const API_BASE = "http://localhost:5000/api"; 

export const addCompany = async (companyData: CompanyFormData) => {
  const formData = new FormData();

  formData.append("name", companyData.name);
  formData.append("location", companyData.location);
  formData.append("foundedOn", companyData.foundedOn);
  formData.append("city", companyData.city);
  formData.append("description", companyData.description);

  if (companyData.logo) {
    formData.append("logo", companyData.logo);
  }

  const response = await fetch(`${API_BASE}/companies/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to add company");
  }

  return response.json();
};

// ✅ Get all companies
export const getAllCompanies = async () => {
  const response = await fetch(`${API_BASE}/companies`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  return response.json();
};
