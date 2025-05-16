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
  Input,
} from "@material-tailwind/react";

export function Message() {
  const [messages, setMessages] = useState([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Fetching the data from the API using Axios
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/getAllMessage",
        );
        setMessages(response.data); // Set the fetched data to the messages state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleReplyClick = (message) => {
    setSelectedMessage(message);
    setReplyDialogOpen(true);
  };

  const handleReplySubmit = async () => {
    if (selectedMessage) {
      try {
        await axios.post("http://localhost:4000/api/replyToUser", {
          id: selectedMessage.id,
          replyMessage,
        });
        // Optionally, you can show a success message or refresh messages here
        setReplyDialogOpen(false);
        setReplyMessage(""); // Reset reply message
      } catch (error) {
        console.error("Error sending reply:", error);
      }
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Messages Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Name",
                  "Email",
                  "Message",
                  "Created At",
                  "Updated At",
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
              {messages.map(
                ({ id, name, email, message, createdAt, updatedAt }, key) => {
                  const className = `py-3 px-5 ${
                    key === messages.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;
                  return (
                    <tr key={id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {message}
                        </Typography>
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
                      <td className={className}>
                        <Button
                          onClick={() =>
                            handleReplyClick({ id, name, email, message })
                          }
                          className="text-xs font-semibold text-white"
                        >
                          Reply
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

      {/* Dialog for replying to a message */}
      <Dialog open={replyDialogOpen} handler={() => setReplyDialogOpen(false)}>
        <DialogHeader>Reply to Message</DialogHeader>
        <DialogBody>
          <Input
            label="Your Reply"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            multiline
            rows={4}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setReplyDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button color="green" onClick={handleReplySubmit}>
            Send Reply
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Message;
