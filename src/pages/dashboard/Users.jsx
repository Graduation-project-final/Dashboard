import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/users/all")
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setUsers(data.data);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSortOrderChange = (selectedValue) => {
    setSortOrder(selectedValue);
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const { name = "", email = "" } = user;
      return (
        name.toLowerCase().includes(searchQuery) ||
        email.toLowerCase().includes(searchQuery)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.profile?.createdAt);
      const dateB = new Date(b.profile?.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(
    indexOfFirstUser,
    indexOfLastUser,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Users Table
          </Typography>
        </CardHeader>
        <div className="flex flex-col md:flex-row gap-4 p-6">
          <Input
            type="text"
            label="Search by Name or Email"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full "
          />
          <Select
            label="Sort Order"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="w-full border-t-0 md:border-t"
          >
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </Select>
        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "ID",
                  "Profile Photo",
                  "Name",
                  "Email",
                  "Role",
                  "Phone Number",
                  "Location",
                  "Occupation",
                  "Date of Birth",
                  "Created At",
                ].map((header) => (
                  <th
                    key={header}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => {
                  const {
                    id,
                    name = "N/A",
                    email = "N/A",
                    role = "N/A",
                    profile = null,
                  } = user;

                  const profilePhoto = profile?.profilePhoto;
                  const phoneNumber = profile?.phoneNumber || "N/A";
                  const location = profile?.location || "N/A";
                  const occupation = profile?.occupation || "N/A";
                  const dateOfBirth = profile?.dateOfBirth || "N/A";
                  const createdAtDate = profile?.createdAt || "N/A";

                  const profilePhotoUrl = profilePhoto
                    ? `http://localhost:4000/${profilePhoto}`
                    : null;

                  const className = `py-3 px-5 ${
                    index === currentUsers.length - 1
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
                        {profilePhotoUrl ? (
                          <Avatar
                            src={profilePhotoUrl}
                            alt={name}
                            size="sm"
                            variant="rounded"
                          />
                        ) : (
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            N/A
                          </Typography>
                        )}
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {role}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {phoneNumber}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {location}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {occupation}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {dateOfBirth !== "N/A"
                            ? new Date(dateOfBirth).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {createdAtDate !== "N/A"
                            ? new Date(createdAtDate).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="text-center py-3 px-5">
                    <Typography className="text-xs font-normal text-blue-gray-500">
                      No users available.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls with Lucide SVG icons */}
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

export default Users;
