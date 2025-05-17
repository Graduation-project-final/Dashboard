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
  Avatar,
  Tooltip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Clock,
  X,
  MapPin,
  Phone,
  Info,
  Image as ImageIcon,
} from "lucide-react";

export function AllService() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [createdAtFilter, setCreatedAtFilter] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 10;

  // Fetching the data from the API using Axios
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/all-services",
        );
        setServices(response.data);
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
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
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
    return true;
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

  // Handle view button click
  const handleViewService = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  return (
    <div className="mt-8 mx-4">
      <Card className="rounded-xl shadow-lg overflow-hidden">
        <CardHeader
          color="teal"
          className="p-6 flex flex-col md:flex-row mt-5 justify-between items-start md:items-center gap-4"
        >
          <div>
            <Typography variant="h4" color="white" className="mb-1">
              Service Management
            </Typography>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Input
                label="Search services..."
                icon={<Search className="h-5 w-5" />}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="!border-white !text-white placeholder-white/70"
                labelProps={{ className: "!text-white" }}
                containerProps={{ className: "min-w-[200px]" }}
              />
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="bg-blue-gray-50/50">
                  {[
                    { label: "Service", key: "title" },
                    { label: "Category", key: "category" },
                    { label: "Subcategory", key: "subcategory" },
                    { label: "Location", key: "address" },
                    { label: "Created", key: "createdAt" },
                    { label: "Actions", key: "actions" },
                  ].map(({ label, key }) => (
                    <th
                      key={key}
                      className="py-4 px-6 cursor-pointer"
                      onClick={() => requestSort(key)}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center gap-1 font-semibold leading-none"
                      >
                        {label}
                        {sortConfig?.key === key && (
                          <span className="text-xs">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-gray-100">
                {currentServices.map(
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
                  }) => (
                    <tr
                      key={id}
                      className="hover:bg-blue-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={`http://localhost:4000/${mainImage}`}
                            alt={title}
                            size="sm"
                            className="border border-blue-gray-50"
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {title}
                            </Typography>
                            <Typography
                              variant="small"
                              className="text-blue-gray-500 line-clamp-1"
                            >
                              {description}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {category}
                        </Typography>
                      </td>
                      <td className="py-4 px-6">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {subcategory}
                        </Typography>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {address}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {contact}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-blue-gray-400" />
                          <Typography
                            variant="small"
                            className="text-blue-gray-600"
                          >
                            {new Date(createdAt).toLocaleDateString()}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-gray-400" />
                          <Typography
                            variant="small"
                            className="text-blue-gray-600"
                          >
                            {new Date(createdAt).toLocaleTimeString()}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Tooltip content="View Details">
                            <Button
                              variant="text"
                              color="teal"
                              size="sm"
                              onClick={() =>
                                handleViewService({
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
                                })
                              }
                            >
                              View
                            </Button>
                          </Tooltip>
                          <Tooltip content="More Options">
                            <Button variant="text" color="blue-gray" size="sm">
                              ⋮
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {currentServices.length === 0 && (
            <div className="p-8 text-center">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                No services found
              </Typography>
              <Typography variant="small" color="blue-gray">
                Try adjusting your search or filter criteria
              </Typography>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              Showing{" "}
              <b>
                {indexOfFirstService + 1}-
                {Math.min(indexOfLastService, finalFilteredServices.length)}
              </b>{" "}
              of <b>{finalFilteredServices.length}</b> services
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="teal"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages).keys()].map((number) => (
                  <Button
                    key={number + 1}
                    variant={currentPage === number + 1 ? "filled" : "text"}
                    color="teal"
                    size="sm"
                    onClick={() => paginate(number + 1)}
                    className={currentPage === number + 1 ? "bg-teal-500" : ""}
                  >
                    {number + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outlined"
                color="teal"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Service Details Modal */}
      <Dialog open={openModal} handler={() => setOpenModal(false)} size="xl">
        <DialogHeader className="flex justify-between items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Service Details
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Complete information about the service
            </Typography>
          </div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={() => setOpenModal(false)}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody divider className="overflow-y-auto max-h-[70vh]">
          {selectedService && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    {selectedService.title}
                  </Typography>
                  <div className="flex items-center gap-2 text-blue-gray-500 mb-4">
                    <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-medium">
                      {selectedService.category}
                    </span>
                    {selectedService.subcategory && (
                      <span className="bg-blue-gray-50 text-blue-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {selectedService.subcategory}
                      </span>
                    )}
                  </div>
                  <Typography className="text-gray-700">
                    {selectedService.description}
                  </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-teal-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        Address
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {selectedService.address}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-teal-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        Contact
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {selectedService.contact}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-teal-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        Created At
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {new Date(selectedService.createdAt).toLocaleString()}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-teal-500 mt-0.5" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        Last Updated
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {new Date(selectedService.updatedAt).toLocaleString()}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold mb-2 flex items-center gap-1"
                  >
                    <ImageIcon className="h-4 w-4" /> Main Image
                  </Typography>
                  <img
                    src={`http://localhost:4000/${selectedService.mainImage}`}
                    alt={selectedService.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>

                {selectedService.subImages &&
                  selectedService.subImages.length > 0 && (
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold mb-2 flex items-center gap-1"
                      >
                        <ImageIcon className="h-4 w-4" /> Additional Images (
                        {selectedService.subImages.length})
                      </Typography>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedService.subImages.map((img, index) => (
                          <img
                            key={index}
                            src={`http://localhost:4000/${img}`}
                            alt={`Sub image ${index + 1}`}
                            className="w-full h-24 rounded object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenModal(false)}
            className="mr-1"
          >
            Close
          </Button>
          <Button variant="gradient" color="teal">
            Edit Service
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AllService;
