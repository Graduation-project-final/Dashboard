import React, { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react"; // Import Lucide icons
import axios from "axios";
import Swal from "sweetalert2";

const UpdateService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    address: "",
    description: "",
    contact: "",
    mainImage: null,
    subImages: [],
  });

  useEffect(() => {
    const fetchServices = async () => {
      const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage
      if (!authToken) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:4000/api/services/businesses",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the token in the header
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services.");
        }

        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      category: service.category,
      subcategory: service.subcategory,
      address: service.address,
      description: service.description,
      contact: service.contact,
      mainImage: null,
      subImages: [],
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append regular form data (title, category, etc.)
    Object.keys(formData).forEach((key) => {
      if (key === "subImages" || key === "mainImage") {
        // Skip these keys for now; we'll handle them later
        return;
      }

      formDataToSend.append(key, formData[key]);
    });

    // Append files (mainImage and subImages) separately
    if (formData.mainImage) {
      Array.from(formData.mainImage).forEach((file) => {
        formDataToSend.append("mainImage", file);
      });
    }

    if (formData.subImages && formData.subImages.length > 0) {
      Array.from(formData.subImages).forEach((file) => {
        formDataToSend.append("subImages", file);
      });
    }

    const authToken = localStorage.getItem("authToken"); // Get token from localStorage
    if (!authToken) {
      setError("No authentication token found.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/services-edit`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type for file upload
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.status === 200) {
        // Update the services state without fetching again
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === selectedService.id
              ? {
                  ...service,
                  ...formData,
                  mainImage: response.data.mainImage,
                  subImages: response.data.subImages,
                }
              : service,
          ),
        );

        setIsModalOpen(false);
      } else {
        throw new Error("Failed to update service.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

const handleDelete = async (id) => {
  const authToken = localStorage.getItem("authToken"); // Get token from localStorage
  if (!authToken) {
    setError("No authentication token found.");
    return;
  }

  // Show SweetAlert2 confirmation dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500", // Tailwind classes for the confirm button
      cancelButton:
        "bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-2 focus:ring-gray-500", // Tailwind classes for the cancel button
    },
    buttonsStyling: false, // Disable default styling to apply your own Tailwind styles
  });

  // If the user confirms, proceed with the delete action
  if (result.isConfirmed) {
    try {
      const response = await axios.delete(
        "http://localhost:4000/api/services-delete",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: { id }, // Send the ID in the body (not in the URL)
        },
      );

      if (response.status === 200) {
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== id),
        );
        Swal.fire("Deleted!", "Service deleted successfully.", "success");
      } else {
        throw new Error("Failed to delete service.");
      }
    } catch (error) {
      setError(error.message);
      Swal.fire("Error", error.message, "error");
    }
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Business Services
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-all relative"
          >
            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleEdit(service)}
                className="text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
              >
                <Trash size={20} />
              </button>
            </div>

            {/* Main Image */}
            <img
              className="w-full h-56 object-cover"
              src={`http://localhost:4000/${service.mainImage}`}
              alt={service.title}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h2>
              <p className="text-sm text-gray-500">
                {service.category} - {service.subcategory}
              </p>
              <p className="text-gray-700 mt-3">{service.description}</p>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-800">
                  Contact: {service.contact}
                </p>
                <p className="text-sm text-gray-500">{service.address}</p>
              </div>

              {/* SubImages */}
              {service.subImages && service.subImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Additional Images
                  </h3>
                  <div className="flex space-x-3 overflow-x-auto">
                    {service.subImages.map((subImage, index) => (
                      <img
                        key={index}
                        className="w-24 h-24 object-cover rounded-lg shadow-md"
                        src={`http://localhost:4000/${subImage}`}
                        alt={`Sub Image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8 relative max-h-[90vh] w-full max-w-xl">
            <div className="bg-white rounded-xl shadow-2xl w-full h-full overflow-hidden">
              {/* Header - Fixed */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Service
                </h2>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Subcategory
                        </label>
                        <input
                          type="text"
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px] resize-y"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Contact
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Main Image
                        </label>
                        <input
                          type="file"
                          name="mainImage"
                          onChange={handleFileChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Sub Images
                        </label>
                        <input
                          type="file"
                          name="subImages"
                          multiple
                          onChange={handleFileChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sticky -bottom-5 bg-white px-6 py-4 border-t">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer - Fixed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateService;
