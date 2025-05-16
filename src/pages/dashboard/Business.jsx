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
  Modal,
  Input,
} from "@material-tailwind/react";

export function Business() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);

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

  const handleEditClick = (subscription) => {
    setSelectedSubscription(subscription);
    setNewStatus(subscription.status); // Set current status as default
    setOpenModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/subscriptions/status",
        {
          subscription_id: selectedSubscription.subscription_id,
          status: newStatus,
        },
      );
      console.log(response.data.message);
      // Refresh subscriptions after update
      const updatedSubscriptions = subscriptions.map((sub) =>
        sub.subscription_id === selectedSubscription.subscription_id
          ? { ...sub, status: newStatus }
          : sub,
      );
      setSubscriptions(updatedSubscriptions);
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Subscriptions Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Company Name",
                  "Contact Email",
                  "Plan",
                  "Status",
                  "Amount",
                  "Start Date",
                  "End Date",
                  "Action",
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
              {subscriptions.map(
                (
                  {
                    subscription_id,
                    company_name,
                    contact_email,
                    plan,
                    status,
                    amount,
                    start_date,
                    end_date,
                  },
                  key,
                ) => {
                  const className = `py-3 px-5 ${
                    key === subscriptions.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={subscription_id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {company_name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {contact_email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {plan.name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status === "active" ? "green" : "red"} // Change color based on status
                          value={status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          ${amount}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(start_date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(end_date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          onClick={() =>
                            handleEditClick({
                              subscription_id,
                              status,
                            })
                          }
                          className="text-xs font-semibold text-white"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Modal for Editing Status */}
      {openModal && (
        <Dialog open={openModal} handler={() => setOpenModal(false)}>
          <DialogHeader>Edit Subscription Status</DialogHeader>
          <DialogBody>
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              >
                <option value="active">Active</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={handleStatusUpdate}
              className="mr-2 bg-blue-500 text-white"
            >
              Update
            </Button>
            <Button
              onClick={() => setOpenModal(false)}
              className="bg-gray-300 text-black"
            >
              Cancel
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}

export default Business;
