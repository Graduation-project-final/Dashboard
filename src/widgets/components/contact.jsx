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
    try {
      await axios.put("http://localhost:4000/api/contacts/1", contact);
      alert("Contact updated successfully!");
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center mt-8">
      <div className="bg-white shadow-md rounded-lg w-full max-w-xl p-6">
        <div className="bg-gray-800 text-white rounded-lg py-4 px-6">
          <h1 className="text-2xl font-bold">Contact Form</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label
              htmlFor="name"
              className="block font-medium mb-1 text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contact.name}
              onChange={handleChange}
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-medium mb-1 text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block font-medium mb-1 text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={contact.phone_number}
              onChange={handleChange}
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Contact
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardContactForm;
