import toast from "react-hot-toast";
import { useState } from "react";

const useGetStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transaction/get-stats`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      setStats(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, getStats, loading};
};
export default useGetStats;
