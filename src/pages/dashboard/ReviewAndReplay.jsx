import React, { useEffect, useState } from "react";
import { MessageCircle, Star, MapPin, Phone } from "lucide-react";
import axios from "axios";

const ReviewAndReplay = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:4000/api/allreviewReplay",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setServices(response.data.services || []);
      } catch (error) {
        console.error("Error fetching the reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const baseUrl = "http://localhost:4000";

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Reviews & Responses
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No reviews available.</p>
        ) : (
          <div className="space-y-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="border-b bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h2>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {service.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {service.subcategory}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-5 h-5" />
                          <span>{service.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-5 h-5" />
                          <span>{service.contact}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={`${baseUrl}/${service.mainImage}`}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                      <MessageCircle className="w-5 h-5" />
                      Customer Reviews
                    </h3>

                    <div className="space-y-6">
                      {service.reviews?.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 rounded-lg p-6 shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={
                                review.user?.profile?.profilePhoto
                                  ? `${baseUrl}/${review.user.profile.profilePhoto}`
                                  : "default-profile.png"
                              }
                              alt={review.user?.name || "Unknown User"}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">
                                  {review.user?.name || "Anonymous"}
                                </h4>
                                <StarRating rating={review.rating || 0} />
                              </div>
                              <p className="mt-2 text-gray-700">
                                {review.content}
                              </p>

                              {review.image && (
                                <img
                                  src={`${baseUrl}/${review.image}`}
                                  alt={`Review by ${
                                    review.user?.name || "Anonymous"
                                  }`}
                                  className="mt-4 rounded-lg max-h-64 object-cover shadow-md"
                                />
                              )}

                              {review.replies?.length > 0 && (
                                <div className="mt-4 space-y-4">
                                  {review.replies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className="ml-6 pl-4 border-l-2 border-gray-200"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={
                                            reply.user?.profile?.profilePhoto
                                              ? `${baseUrl}/${reply.user.profile.profilePhoto}`
                                              : "default-reply-profile.png"
                                          }
                                          alt={
                                            reply.user?.name || "Unknown User"
                                          }
                                          className="w-8 h-8 rounded-full object-cover ring-1 ring-white shadow-sm"
                                        />
                                        <div>
                                          <h5 className="font-medium text-gray-900">
                                            {reply.user?.name || "Anonymous"}
                                          </h5>
                                          <p className="text-gray-600 mt-1">
                                            {reply.content ||
                                              "No reply content."}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAndReplay;
