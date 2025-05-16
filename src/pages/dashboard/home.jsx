import React, { useEffect, useState } from "react";
import axios from "axios";
import { StatisticsCard } from "@/widgets/cards";
import { Typography } from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsChartsData } from "@/data";
import { ClockIcon } from "@heroicons/react/24/solid";
import { UsersIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import Contact from "@/widgets/components/contact";

export function Home() {
  const [userDataLength, setUserDataLength] = useState(null);
  const [serviceDataLength, setServiceDataLength] = useState(null);
  const [subscriptionDataLength, setSubscriptionDataLength] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get(
        "http://localhost:4000/api/users/all",
      );
      console.log("User response:", userResponse.data); // Debugging: Inspect the API response

      if (Array.isArray(userResponse.data.data)) {
        setUserDataLength(userResponse.data.data.length);
      } else {
        console.error("Unexpected user data structure");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch service data
  const fetchServiceData = async () => {
    try {
      const serviceResponse = await axios.get(
        "http://localhost:4000/api/all-services",
      );
      console.log("Service response:", serviceResponse.data); // Debugging: Inspect the API response

      if (Array.isArray(serviceResponse.data)) {
        setServiceDataLength(serviceResponse.data.length);
      } else {
        console.error("Unexpected service data structure");
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };

  // Fetch subscription data
  const fetchSubscriptionData = async () => {
    try {
      const subscriptionResponse = await axios.get(
        "http://localhost:4000/api/subscriptions/get-all",
      );
      console.log("Subscription response:", subscriptionResponse.data); // Debugging: Inspect the API response

      if (Array.isArray(subscriptionResponse.data.subscriptions)) {
        setSubscriptionDataLength(
          subscriptionResponse.data.subscriptions.length,
        );
      } else {
        console.error("Unexpected subscription data structure");
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchServiceData();
    fetchSubscriptionData();
  }, []);

  return (
    <>
      <div className="mt-12">
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          <StatisticsCard
            color="gray"
            title="Total User's"
            icon={React.createElement(UsersIcon, {
              className: "w-6 h-6 text-white",
            })}
            value={userDataLength !== null ? `${userDataLength}` : "$0k"}
            footer={null}
          />
          <StatisticsCard
            color="gray"
            title="Total Service"
            icon={React.createElement(UsersIcon, {
              className: "w-6 h-6 text-white",
            })}
            value={serviceDataLength !== null ? serviceDataLength : "0"}
            footer={null}
          />
          <StatisticsCard
            color="gray"
            title="Total Business"
            icon={React.createElement(UserPlusIcon, {
              className: "w-6 h-6 text-white",
            })}
            value={
              subscriptionDataLength !== null ? subscriptionDataLength : "0"
            }
            footer={null}
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          {statisticsChartsData.map((props) => (
            <StatisticsChart
              key={props.title}
              {...props}
              footer={
                <Typography
                  variant="small"
                  className="flex items-center font-normal text-blue-gray-600"
                >
                  <ClockIcon
                    strokeWidth={2}
                    className="h-4 w-4 text-blue-gray-400"
                  />
                  &nbsp;{props.footer}
                </Typography>
              }
            />
          ))}
        </div>
      </div>
      <Contact />
    </>
  );
}

export default Home;
