import toast from "react-hot-toast";
import { useTransactionContext } from "../../context/TransactionContext";

const useGetAllTransactions = () => {
  const { setTransactions, setMeta } = useTransactionContext();

  const getAllTransactions = async (page, limit) => {
    try {
      const res = await fetch(`/api/transaction?page=${page}&limit=${limit}`, {
        method: "GET",
      });

      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      setTransactions(data.data);
      setMeta(data.meta)
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { getAllTransactions };
};
export default useGetAllTransactions;
