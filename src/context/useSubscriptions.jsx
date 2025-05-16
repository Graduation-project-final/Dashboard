import { useState, useEffect } from "react";
import axios from "axios";

const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);

        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("Authentication token is missing.");
        }

        const response = await axios.get(
          "http://localhost:4000/api/businessAdmin/subscriptions",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        const fetchedSubscriptions = response.data.subscriptions || [];

        if (fetchedSubscriptions.length > 0) {
          const features = fetchedSubscriptions[0].plan.features;
          localStorage.setItem(
            "subscriptionFeatures",
            JSON.stringify(features),
          );
        }

        setSubscriptions(fetchedSubscriptions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return { subscriptions, loading, error };
};

export default useSubscriptions;
