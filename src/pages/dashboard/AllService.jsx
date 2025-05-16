import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing Lucide icons

export function AllService() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [createdAtFilter, setCreatedAtFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 10; // Number of services per page

  // Fetching the data from the API using Axios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/all-services",
        );
        setServices(response.data); // Set the fetched data to the services state
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // Helper function to calculate if a date is within the last 7 days
  const isNewService = (createdAt) => {
    const today = new Date();
    const createdDate = new Date(createdAt);
    const differenceInTime = today - createdDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert to days
    return differenceInDays <= 7;
  };

  // Sorting function
  const sortedServices = React.useMemo(() => {
    let sortableServices = [...services];

    if (sortConfig !== null) {
      sortableServices.sort((a, b) => {
        const { key, direction } = sortConfig;
        if (key === "createdAt") {
          const dateA = new Date(a[key]);
          const dateB = new Date(b[key]);
          if (dateA < dateB) {
            return direction === "ascending" ? -1 : 1;
          }
          if (dateA > dateB) {
            return direction === "ascending" ? 1 : -1;
          }
        } else if (a[key] < b[key]) {
          return direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableServices;
  }, [services, sortConfig]);

  // Handle sort change
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Filter services based on search term
  const filteredServices = sortedServices.filter(
    ({ title, category, subcategory, createdAt }) =>
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(createdAt).toLocaleString().includes(searchTerm.toLowerCase()),
  );

  // Filter by "New" or "Old" based on Created At
  const finalFilteredServices = filteredServices.filter((service) => {
    if (createdAtFilter === "new") {
      return isNewService(service.createdAt);
    }
    if (createdAtFilter === "old") {
      return !isNewService(service.createdAt);
    }
    return true; // "all" filter
  });

  // Pagination Logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = finalFilteredServices.slice(
    indexOfFirstService,
    indexOfLastService,
  );

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(finalFilteredServices.length / servicesPerPage);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            All Services
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <br />
          <div className="flex gap-4 mb-4">
            <Input
              label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className="w-full"
            />
            <Select
              label="Filter by Created At"
              value={createdAtFilter}
              onChange={(e) => setCreatedAtFilter(e)}
              className="w-full"
            >
              <Option value="all">All</Option>
              <Option value="new">New (Last 7 Days)</Option>
              <Option value="old">Old (Before Last 7 Days)</Option>
            </Select>
          </div>

          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "ID",
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
                    className="border-b border-blue-gray-50 w-[800px] py-3 px-5 text-left"
                    onClick={() => requestSort(el.toLowerCase())} // Allow sorting
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
              {currentServices.map(
                (
                  {
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
                  },
                  key,
                ) => {
                  const className = `py-8 px-5 ${
                    key === currentServices.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {id}
                        </Typography>
                      </td>
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
                      <td className={`${className} w-[200px] -px-8`}>
                        <img
                          src={`http://localhost:4000/${mainImage}`}
                          alt={title}
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                      <td className={`${className} w-[300px] -px-8`}>
                        <div className="flex overflow-x-auto gap-2">
                          {subImages.map((img, index) => (
                            <img
                              key={index}
                              src={`http://localhost:4000/${img}`}
                              alt={`Sub image ${index + 1}`}
                              className="w-20 h-20 object-cover inline-block"
                            />
                          ))}
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(createdAt).toLocaleString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(updatedAt).toLocaleString()}
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
              className="px-4 py-2 text-sm font-semibold text-black  rounded-l"
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
              className="px-4 py-2 text-sm font-semibold text-black  rounded-r"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AllService;
