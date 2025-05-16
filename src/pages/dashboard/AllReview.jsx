"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader,
  AlertCircle,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Info,
} from "lucide-react";

export default function AllReview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedServices, setExpandedServices] = useState(new Set());

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:4000/api/allreviewReplayBusiness",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setServices(response.data.services);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const toggleServiceExpansion = (serviceId) => {
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center">
          <Loader
            className="animate-spin text-blue-600 mx-auto mb-4"
            size={48}
          />
          <p className="text-gray-600 animate-pulse">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto m-8">
        <div className=" rounded-lg shadow-lg border border-red-200 p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-500 h-6 w-6" />
            <div>
              <h3 className="font-semibold text-red-700">Error Occurred</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Service Reviews
        </h1>

        {services.length > 0 ? (
          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className="p-6 cursor-pointer border-b border-gray-100"
                  onClick={() => toggleServiceExpansion(service.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {service.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {service.category} • {service.subcategory}
                      </p>
                    </div>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-expanded={expandedServices.has(service.id)}
                    >
                      {expandedServices.has(service.id) ? (
                        <ChevronUp className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedServices.has(service.id) && (
                  <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {service.mainImage && (
                        <img
                          src={`http://localhost:4000/${service.mainImage}`}
                          alt={service.title}
                          className="rounded-lg w-full h-64 object-cover shadow-md"
                        />
                      )}
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-5 w-5" />
                          <span>{service.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-5 w-5" />
                          <span>{service.contact}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-gray-600">
                          <Info className="h-5 w-5 mt-1 flex-shrink-0" />
                          <p>{service.description}</p>
                        </div>
                      </div>
                    </div>

                    {service.subImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-4">
                        {service.subImages.map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:4000/${image}`}
                            alt={`Gallery ${index + 1}`}
                            className="rounded-lg h-24 w-full object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
                          />
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Reviews
                      </h3>
                      {service.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {service.reviews.map((review) => (
                            <div
                              key={review.id}
                              className="bg-gray-50 rounded-lg p-6 shadow-sm space-y-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {review.title}
                                  </h4>
                                  <div className="flex mt-1">
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <Star
                                          key={index}
                                          className={`h-5 w-5 ${
                                            index < review.rating
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>

                              <p className="text-gray-600 leading-relaxed">
                                {review.content}
                              </p>

                              {review.image && (
                                <img
                                  src={`http://localhost:4000/${review.image}`}
                                  alt="Review"
                                  className="rounded-lg w-full h-48 object-cover shadow-sm"
                                />
                              )}

                              {review.replies.length > 0 && (
                                <div className="space-y-3">
                                  <h5 className="font-semibold text-gray-700">
                                    Responses
                                  </h5>
                                  {review.replies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="bg-white rounded-lg p-4 ml-4 border-l-4 border-blue-400 shadow-sm"
                                    >
                                      <p className="text-gray-600">
                                        {reply.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center bg-gray-50 rounded-lg py-8">
                          <p className="text-gray-500">
                            No reviews yet. Be the first to review!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500">
              No services available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
