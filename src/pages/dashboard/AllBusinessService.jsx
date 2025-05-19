import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

export function AllBusinessService() {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
    return sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const indexOfLastBusiness = currentPage * itemsPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - itemsPerPage;
  const currentBusinesses = sortedBusinesses.slice(
    indexOfFirstBusiness,
    indexOfLastBusiness,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(sortedBusinesses.length / itemsPerPage);

  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setOpenDialog(true);
  };

  return (
    <div className="mt-10 mx-auto max-w-7xl px-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Business Services Overview
        </Typography>
        <div className="mt-4 md:mt-0 flex gap-3">
          <input
            type="text"
            placeholder="Search title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-md w-60"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-md"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBusinesses.map((b) => (
          <Card key={b.id} className="shadow-md hover:shadow-xl transition">
            <img
              src={`http://localhost:4000/${b.mainImage}`}
              alt={b.title}
              className="h-48 w-full object-cover rounded-t-lg"
            />
            <CardBody>
              <Typography variant="h6" className="text-gray-800">
                {b.title}
              </Typography>
              <Typography className="text-xs text-gray-500 mb-2">
                {b.category} - {b.subcategory}
              </Typography>
              <Typography className="text-sm text-gray-700">
                {b.description.length > 60
                  ? `${b.description.substring(0, 60)}...`
                  : b.description}
              </Typography>
              <Button
                size="sm"
                variant="outlined"
                className="mt-4 flex items-center gap-2"
                onClick={() => handleViewDetails(b)}
              >
                <Eye size={16} /> View Details
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-10 gap-1">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-gray-300 text-black rounded-l"
        >
          <ChevronLeft size={18} />
        </button>
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => paginate(num + 1)}
            className={`px-3 py-1 text-sm font-semibold ${
              currentPage === num + 1
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {num + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-gray-300 text-black rounded-r"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="lg">
        <DialogHeader>{selectedBusiness?.title}</DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto">
          <Typography variant="h6">
            Category: {selectedBusiness?.category}
          </Typography>
          <Typography>Subcategory: {selectedBusiness?.subcategory}</Typography>
          <Typography>Address: {selectedBusiness?.address}</Typography>
          <Typography>Description: {selectedBusiness?.description}</Typography>
          <Typography>Contact: {selectedBusiness?.contact}</Typography>
          <Typography>
            Created At:{" "}
            {new Date(selectedBusiness?.createdAt).toLocaleDateString()}
          </Typography>
          <Typography>
            Updated At:{" "}
            {new Date(selectedBusiness?.updatedAt).toLocaleDateString()}
          </Typography>
          <div className="mt-4">
            <img
              src={`http://localhost:4000/${selectedBusiness?.mainImage}`}
              alt="Main"
              className="w-full h-64 object-cover rounded"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {selectedBusiness?.subImages?.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:4000/${img}`}
                  alt="Sub"
                  className="w-20 h-20 object-cover rounded shadow-sm"
                />
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpenDialog(false)} className="bg-teal-600">
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AllBusinessService;
