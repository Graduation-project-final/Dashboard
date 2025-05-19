import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Avatar,
  Tooltip,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import { InformationCircleIcon, PencilIcon } from "@heroicons/react/24/solid";

export function Business() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/subscriptions/get-all",
        );
        setSubscriptions(response.data.subscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleEditClick = (subscription) => {
    setSelectedSubscription(subscription);
    setNewStatus(subscription.status);
    setOpenModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put("http://localhost:4000/api/subscriptions/status", {
        subscription_id: selectedSubscription.subscription_id,
        status: newStatus,
      });

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.subscription_id === selectedSubscription.subscription_id
            ? { ...sub, status: newStatus }
            : sub,
        ),
      );
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  const statusColors = {
    active: "green",
    declined: "red",
    pending: "amber",
    expired: "purple",
    canceled: "gray",
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg">
        <CardHeader variant="gradient" color="teal" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h5" color="white">
              Business Subscriptions Management
            </Typography>
            <Typography variant="small" color="white">
              Total: {subscriptions.length} subscriptions
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] table-auto">
              <thead>
                <tr>
                  {[
                    "Company",
                    "Contact",
                    "Plan",
                    "Status",
                    "Amount",
                    "Dates",
                    "Actions",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-xs font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => {
                  const {
                    subscription_id,
                    company_name,
                    contact_email,
                    plan,
                    status,
                    amount,
                    start_date,
                    end_date,
                    user,
                    phone_number,
                    company_address,
                    business_description,
                    website_url,
                  } = subscription;

                  const isExpanded = expandedRows.includes(subscription_id);
                  const formattedStartDate = new Date(
                    start_date,
                  ).toLocaleDateString();
                  const formattedEndDate = new Date(
                    end_date,
                  ).toLocaleDateString();

                  return (
                    <React.Fragment key={subscription_id}>
                      <tr className="hover:bg-blue-gray-50 transition-colors">
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={`https://ui-avatars.com/api/?name=${company_name}&background=random`}
                              size="sm"
                              className="border border-blue-gray-100"
                            />
                            <div>
                              <Typography
                                variant="small"
                                className="font-semibold"
                              >
                                {company_name}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-blue-gray-500"
                              >
                                {user?.name}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <Typography variant="small" className="font-medium">
                            {contact_email}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {phone_number}
                          </Typography>
                        </td>
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <Chip
                            variant="outlined"
                            color="blue"
                            value={plan?.name}
                            className="text-xs font-medium w-fit"
                          />
                        </td>
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <Chip
                            variant="gradient"
                            color={statusColors[status] || "blue"}
                            value={status}
                            className="py-0.5 px-2 text-xs font-medium w-fit capitalize"
                          />
                        </td>
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <Typography variant="small" className="font-bold">
                            ${amount}
                          </Typography>
                        </td>
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <div className="flex flex-col">
                            <Typography variant="small">
                              <span className="font-medium">Start:</span>{" "}
                              {formattedStartDate}
                            </Typography>
                            <Typography variant="small">
                              <span className="font-medium">End:</span>{" "}
                              {formattedEndDate}
                            </Typography>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-blue-gray-50">
                          <div className="flex gap-2">
                            <Tooltip content="Edit Status">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => handleEditClick(subscription)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="View Details">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => toggleRowExpand(subscription_id)}
                              >
                                <InformationCircleIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-blue-gray-50/50">
                          <td colSpan={7} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <Typography
                                  variant="h6"
                                  className="mb-2 text-sm font-bold"
                                >
                                  Business Information
                                </Typography>
                                <div className="space-y-2">
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      Address:
                                    </span>{" "}
                                    {company_address}
                                  </Typography>
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      Website:
                                    </span>{" "}
                                    <a
                                      href={website_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {website_url}
                                    </a>
                                  </Typography>
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {business_description}
                                  </Typography>
                                </div>
                              </div>
                              <div>
                                <Typography
                                  variant="h6"
                                  className="mb-2 text-sm font-bold"
                                >
                                  Subscription Details
                                </Typography>
                                <div className="space-y-2">
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      Billing Cycle:
                                    </span>{" "}
                                    {subscription.billing_cycle}
                                  </Typography>
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      Created:
                                    </span>{" "}
                                    {new Date(
                                      subscription.created_at,
                                    ).toLocaleString()}
                                  </Typography>
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      Last Updated:
                                    </span>{" "}
                                    {new Date(
                                      subscription.updated_at,
                                    ).toLocaleString()}
                                  </Typography>
                                </div>
                              </div>
                              <div>
                                <Typography
                                  variant="h6"
                                  className="mb-2 text-sm font-bold"
                                >
                                  User Information
                                </Typography>
                                <div className="space-y-2">
                                  <Typography variant="small">
                                    <span className="font-medium">
                                      User ID:
                                    </span>{" "}
                                    {user?.id}
                                  </Typography>
                                  <Typography variant="small">
                                    <span className="font-medium">Email:</span>{" "}
                                    {user?.email}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Edit Status Modal */}
      <Dialog open={openModal} handler={() => setOpenModal(false)} size="sm">
        <DialogHeader>Update Subscription Status</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Company
              </Typography>
              <Input
                value={selectedSubscription?.company_name || ""}
                disabled
                labelProps={{ className: "hidden" }}
              />
            </div>
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Current Status
              </Typography>
              <Chip
                variant="gradient"
                color={statusColors[selectedSubscription?.status] || "blue"}
                value={selectedSubscription?.status}
                className="w-fit capitalize"
              />
            </div>
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                New Status
              </Typography>
              <Select
                value={newStatus}
                onChange={(value) => setNewStatus(value)}
                label="Select Status"
                className="!min-w-full"
              >
                <Option value="active">Active</Option>
                <Option value="declined">Declined</Option>
                <Option value="pending">Pending</Option>
                <Option value="expired">Expired</Option>
                <Option value="canceled">Canceled</Option>
              </Select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenModal(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="teal" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Business;
