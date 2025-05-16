import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AllBusinessService() {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:4000/api/services/businesses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setBusinesses(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter((business) =>
    business.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedBusinesses = filteredBusinesses.sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const indexOfLastBusiness = currentPage * itemsPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - itemsPerPage;
  const currentBusinesses = sortedBusinesses.slice(
    indexOfFirstBusiness,
    indexOfLastBusiness,
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg rounded-lg">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 rounded-t-lg"
        >
          <Typography variant="h6" color="white" className="text-center">
            Business Services Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {/* Search and Sort controls */}
          <div className="mb-4 flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-md w-80"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-md w-36"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <table className="w-full min-w-[720px] table-auto border-collapse">
            <thead>
              <tr>
                {[
                  "Title",
                  "Category",
                  "Subcategory",
                  "Address",
                  "Description",
                  "Contact",
                  "Main Image",
                  "Sub Images",
                  "Created At",
                  "Updated At",
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
              {currentBusinesses.map(
                ({
                  id,
                  title,
                  category,
                  subcategory,
                  address,
                  description,
                  contact,
                  mainImage,
                  subImages,
                  createdAt,
                  updatedAt,
                }) => {
                  const className = "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {title}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {category}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {subcategory}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {address}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {description}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {contact}
                        </Typography>
                      </td>
                      <td className={className}>
                        <img
                          src={`http://localhost:4000/${mainImage}`}
                          alt={title}
                          className="w-20 h-20 object-cover rounded-md shadow-md"
                        />
                      </td>
                      <td className={`${className} w-40`}>
                        <div className="flex gap-2 overflow-x-auto">
                          {subImages.map((image, index) => (
                            <img
                              key={index}
                              src={`http://localhost:4000/${image}`}
                              alt={`${title} sub-image ${index + 1}`}
                              className="w-12 h-12 object-cover rounded-md shadow-sm"
                            />
                          ))}
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(createdAt).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(updatedAt).toLocaleDateString()}
                        </Typography>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-black rounded-l bg-gray-300"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 text-sm font-semibold ${
                  currentPage === number + 1
                    ? "bg-white text-black"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-black rounded-r bg-gray-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AllBusinessService;
