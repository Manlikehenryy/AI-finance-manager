import { useState } from "react";
import toast from "react-hot-toast";
import { useBudgetContext } from "../../context/BudgetContext";

const useCreateBudget = () => {
  const [loading, setLoading] = useState(false);
  const { budgets, setBudgets } = useBudgetContext();

  const createBudget = async ({
    category,
    allocatedAmount,
    spentAmount,
    startDate,
    endDate,
  }) => {
    setLoading(true);
    try {
      allocatedAmount = Number(allocatedAmount);
      spentAmount = Number(spentAmount);

      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          allocatedAmount,
          spentAmount,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      const prevBudgets = budgets;
      prevBudgets.unshift(data.data);

      setBudgets(prevBudgets);
      toast.success("Budget created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createBudget };
};
export default useCreateBudget;
