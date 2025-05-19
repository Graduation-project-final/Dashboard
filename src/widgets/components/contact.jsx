import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboardContactForm = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/contacts");
        setContact(response.data[0]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contact data");
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    try {
      await axios.put("http://localhost:4000/api/contacts/2", contact);
      setSuccessMessage("Contact updated successfully!");
    } catch (err) {
      setError("Failed to update contact");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-4">Loading...</p>;
  }

  return (
    <div className="flex justify-center px-4 mt-10">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-teal-600 text-white py-6 px-8">
          <h1 className="text-3xl font-bold">Update Contact Information</h1>
          <p className="text-teal-100 text-sm mt-1">
            You can manage your contact details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <p className="text-red-500 font-medium">{error}</p>}
          {successMessage && (
            <p className="text-green-600 font-medium">{successMessage}</p>
          )}

          <div>
            <label
              htmlFor="name"
              className="block font-semibold text-teal-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contact.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-semibold text-teal-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block font-semibold text-teal-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={contact.phone_number}
              onChange={handleChange}
              className="w-full border border-gray-300 px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-semibold py-2 rounded-lg hover:bg-teal-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Update Contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardContactForm;
