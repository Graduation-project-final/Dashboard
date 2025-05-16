import React, { useState, useEffect } from "react";
import useSubscriptions from "../../context/useSubscriptions";

const BusinessService = () => {
  const { subscriptions, loading, error } = useSubscriptions();

  const categories = {
    Restaurants: [
      "TakeOut",
      "Thai",
      "Delivery",
      "Burgers",
      "Chinese",
      "Italian",
      "Reservation",
      "Mexican",
    ],
    Services: [
      "Cleaning",
      "Plumbing",
      "Electrical",
      "Landscaping",
      "Carpentry",
      "Moving",
      "Handyman",
      "Design",
    ],
    AutoServices: [
      "CarMaintenance",
      "TireChange",
      "EngineRepair",
      "OilChange",
      "BrakeService",
      "Detailing",
      "Inspection",
      "EmergencyTowing",
    ],
    More: [
      "DryCleaning",
      "PhoneRepair",
      "Cafes",
      "OutdoorActivities",
      "HairSalons",
      "Gyms",
      "Spas",
      "Shopping",
    ],
  };

  const [formData, setFormData] = useState({
    mainImage: null,
    title: "",
    category: "",
    subcategory: "",
    address: "",
    description: "",
    contact: "",
    subImages: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (name === "subImages") {
        const fileArray = Array.from(files);
        const previewArray = fileArray.map((file) => URL.createObjectURL(file));
        setFormData({
          ...formData,
          [name]: fileArray,
          subImagesPreview: previewArray,
        });
      } else {
        setFormData({
          ...formData,
          [name]: files[0],
          mainImagePreview: URL.createObjectURL(files[0]),
        });
      }
    } else {
      if (name === "category") {
        setFormData({
          ...formData,
          [name]: value,
          subcategory: "",
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    // Fetch subscription features and handle potential issues
    const storedFeaturesRaw = localStorage.getItem("subscriptionFeatures");
    let storedFeatures;
    try {
      storedFeatures = storedFeaturesRaw ? JSON.parse(storedFeaturesRaw) : null;
    } catch (error) {
      console.error(
        "Failed to parse subscription features from localStorage:",
        error,
      );
      setSubmitStatus({
        type: "error",
        message: "Invalid subscription data. Please contact support.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!storedFeatures || !storedFeatures.feature1) {
      setSubmitStatus({
        type: "error",
        message: "Subscription feature not found. Please check your plan.",
      });
      setIsSubmitting(false);
      return;
    }

    const feature1 = storedFeatures.feature1;
    console.log("Feature1 detected:", feature1);

    // Determine product limit based on feature1
    let productLimit;
    if (feature1 === "Display up to 10 products") {
      productLimit = 10;
    } else if (feature1 === "Display up to 50 products") {
      productLimit = 50;
    } else if (feature1 === "Unlimited product display") {
      productLimit = Infinity;
    } else {
      setSubmitStatus({
        type: "error",
        message: "Invalid subscription feature. Please contact support.",
      });
      setIsSubmitting(false);
      return;
    }

    // Get the current count of added services
    const currentServicesCount = parseInt(
      localStorage.getItem("addedServicesCount") || "0",
      10,
    );
    console.log("Current Services Count:", currentServicesCount);

    // Check formData.subImages, but we will add only one service per submission
    console.log("FormData SubImages:", formData.subImages);
    console.log("Number of SubImages:", formData.subImages.length);

    // Calculate the new total count if this submission is successful (only adding 1 service here)
    const newTotalCount = currentServicesCount + 1; // Always add 1 service per submission
    console.log("New Total Count:", newTotalCount);

    // Validate the new total against the product limit
    if (newTotalCount > productLimit) {
      setSubmitStatus({
        type: "error",
        message: `Your plan allows uploading up to ${productLimit} products. You already have ${currentServicesCount} and are trying to add one more.`,
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare form data for submission
    const authToken = localStorage.getItem("authToken");
    const formDataToSend = new FormData();

    formDataToSend.append("mainImage", formData.mainImage);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subcategory", formData.subcategory);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("contact", formData.contact);

    formData.subImages.forEach((file) => {
      formDataToSend.append("subImages", file);
    });

    // Submit the form data
    try {
      const response = await fetch(
        "http://localhost:4000/api/services-create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formDataToSend,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();

      // Update the local count on successful submission (always add 1)
      const updatedServicesCount = currentServicesCount + 1;
      localStorage.setItem(
        "addedServicesCount",
        updatedServicesCount.toString(),
      );

      setSubmitStatus({
        type: "success",
        message: "Business service created successfully!",
      });
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // For debugging: Log the current features and count
    const storedFeatures = localStorage.getItem("subscriptionFeatures");
    console.log("Stored Features in Local Storage:", storedFeatures);

    const currentCount = localStorage.getItem("addedServicesCount");
    console.log("Current Services Count:", currentCount);
  }, []);

  useEffect(() => {
    const storedFeatures = localStorage.getItem("subscriptionFeatures");
    console.log("Stored Features in Local Storage:", storedFeatures);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add Business Service
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create a new business service listing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className="relative">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload main image</span>
                          <input
                            type="file"
                            id="mainImage"
                            name="mainImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="sr-only"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                {/* Main Image Preview */}
                {formData.mainImagePreview && (
                  <img
                    src={formData.mainImagePreview}
                    alt="Main preview"
                    className="w-full h-32 object-cover rounded-md mt-2"
                  />
                )}
              </div>

              {/* Sub Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Images
                </label>
                <div className="relative">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload multiple images</span>
                          <input
                            type="file"
                            id="subImages"
                            name="subImages"
                            accept="image/*"
                            onChange={handleChange}
                            className="sr-only"
                            multiple
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                {/* Sub Images Preview */}
                {formData.subImagesPreview &&
                  formData.subImagesPreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {formData.subImagesPreview.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Sub preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  placeholder="Enter business title"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  required
                >
                  <option value="">Select a category</option>
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select a subcategory</option>
                  {formData.category &&
                    categories[formData.category].map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                  placeholder="Enter contact information"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                placeholder="Enter business address"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                placeholder="Enter business description"
                required
              />
            </div>

            {/* Status Message */}
            {submitStatus.message && (
              <div
                className={`rounded-md p-4 ${
                  submitStatus.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#383838] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting
                  ? "Creating Service..."
                  : "Create Business Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessService;
