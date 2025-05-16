import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function ReportsTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("http://localhost:4000/api/reports/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setReports(response.data.reports || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - redirect to login");
      }
    }
  };

  const handleDeleteClick = (reportId) => {
    setReportToDelete(reportId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(
        `http://localhost:4000/api/reports/${reportToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Refresh the reports list after successful deletion
      await fetchReports();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting report:", error);
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - redirect to login");
      }
    }
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Reports Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Report ID",
                  "User",
                  "Service",
                  "Review",
                  "Description",
                  "Created At",
                  "Actions",
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
              {reports.map((report, key) => {
                const className = `py-3 px-5 ${
                  key === reports.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={report.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.id}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {report.user?.name || "N/A"}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {report.user?.email || "N/A"}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.service?.title || "N/A"}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {report.service?.category || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.review?.title || "No review"}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        Rating: {report.review?.rating || "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {report.description || "No description"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Button
                        color="red"
                        size="sm"
                        onClick={() => handleDeleteClick(report.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this report? This action cannot be
          undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleDeleteConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ReportsTable;
