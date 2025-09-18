import { useState } from "react";
import { addCompany, type CompanyFormData } from "../services/companyService";
import { toast } from "react-hot-toast";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // called after successful save to refresh parent
}

const AddCompanyModal = ({ isOpen, onClose, onSave }: AddCompanyModalProps) => {
  const initialFormState: CompanyFormData = {
    name: "",
    location: "",
    foundedOn: "",
    city: "",
    logo: null,
    description: "",
  };

  const [formData, setFormData] = useState<CompanyFormData>(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await addCompany(formData); // save company
      toast.success("Company saved successfully!");
      onSave(); // refresh parent
      onClose(); // close modal
      setFormData(initialFormState); // reset form
    } catch (error) {
      console.error(error);
      toast.error("Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[80%] shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Add Company</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Founded On</label>
            <input
              type="date"
              name="foundedOn"
              value={formData.foundedOn}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
              disabled={loading}
            />
            {formData.logo && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {formData.logo.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-4 px-6 py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
