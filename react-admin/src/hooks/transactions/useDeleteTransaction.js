import toast from "react-hot-toast";
import { useTransactionContext } from "../../context/TransactionContext";

const useDeleteTransactions = () => {
  const { transactions ,setTransactions } = useTransactionContext();

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`/api/transaction/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      
      const prevTransactions = transactions
      const updatedTransactions = prevTransactions.filter((transaction)=> transaction._id != id)
      setTransactions(updatedTransactions);
      toast.success("Transaction deleted successfully")
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { deleteTransaction };
};
export default useDeleteTransactions;
