import { useState } from "react";
import toast from "react-hot-toast";
import { useTransactionContext } from "../../context/TransactionContext";

const useUpdateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { transactions, setTransactions } = useTransactionContext();

  const updateTransaction = async ({
    id,
    category,
    amount,
    transactionDate,
    type,
    description,
  }) => {
    setLoading(true);
    try {
      amount = Number(amount);

      const res = await fetch(`/api/transaction/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          amount,
          transactionDate,
          type,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      const prevTransactions = transactions;
      const index = prevTransactions.findIndex(
        (transaction) => transaction._id.toString() === id
      );

      if (index !== -1) {
        const updatedTransactions = [
          ...prevTransactions.slice(0, index),
          data.data,
          ...prevTransactions.slice(index + 1),
        ];

        setTransactions(updatedTransactions);
      }
      toast.success("Transaction updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateTransaction };
};
export default useUpdateTransaction;
