import { useState } from "react";
import toast from "react-hot-toast";
import { useTransactionContext } from "../../context/TransactionContext";

const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { transactions, setTransactions } = useTransactionContext();

  const createTransaction = async ({
    category,
    amount,
    transactionDate,
    type,
    description,
  }) => {
    setLoading(true);
    try {
      amount = Number(amount);

      const res = await fetch("/api/transaction", {
        method: "POST",
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
      prevTransactions.unshift(data.data);

      setTransactions(prevTransactions);
      toast.success("Transaction created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createTransaction };
};
export default useCreateTransaction;
