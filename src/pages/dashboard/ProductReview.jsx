import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Spinner,
} from "@material-tailwind/react";

export function Tables() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/reviews-product-all",
      );
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const BASE_URL = "http://localhost:4000/";

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="teal" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Product Reviews Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <table className="w-full min-w-[840px] table-auto">
              <thead>
                <tr>
                  {[
                    "User ID",
                    "User Name & Email",
                    "Product Info",
                    "Product Image",
                    "Rating",
                    "Review",
                    "Date",
                    "",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, key) => {
                  const className = `py-3 px-5 ${
                    key === reviews.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={review.id}>
                      {/* User ID */}
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {review.userId}
                        </Typography>
                      </td>

                      {/* User name and email */}
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {review.user?.name}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {review.user?.email}
                        </Typography>
                      </td>

                      {/* Product title and category */}
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {review.product?.title}
                        </Typography>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {review.product?.category}
                        </Typography>
                      </td>

                      {/* Product image */}
                      <td className={className}>
                        <img
                          src={`${BASE_URL}${review.product?.mainImage}`}
                          alt="product"
                          className="h-14 w-14 object-cover rounded-md"
                        />
                      </td>

                      {/* Rating */}
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color="blue"
                          value={review.rate}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>

                      {/* Description */}
                      <td className={className}>
                        <Typography className="text-xs text-blue-gray-700">
                          {review.description}
                        </Typography>
                      </td>

                      {/* Date */}
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </td>

                      {/* Action */}
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          Edit
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
