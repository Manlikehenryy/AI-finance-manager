import { useState } from "react";
import toast from "react-hot-toast";
import { useBudgetContext } from "../../context/BudgetContext";

const useUpdateBudget = () => {
  const [loading, setLoading] = useState(false);
  const { budgets, setBudgets } = useBudgetContext();

  const updateBudget = async ({
    id,
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

      const res = await fetch(`/api/budget/${id}`, {
        method: "PUT",
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
      const index = prevBudgets.findIndex(
        (budget) => budget._id.toString() === id
      );

      if (index !== -1) {
        const updatedBudgets = [
          ...prevBudgets.slice(0, index),
          data.data,
          ...prevBudgets.slice(index + 1),
        ];

        setBudgets(updatedBudgets);
      }
      toast.success("Budget updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateBudget };
};
export default useUpdateBudget;
