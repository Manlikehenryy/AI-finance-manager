import toast from "react-hot-toast";
import { useBudgetContext } from "../../context/BudgetContext";

const useDeleteBudget = () => {
  const { budgets ,setBudgets } = useBudgetContext();

  const deleteBudget = async (id) => {
    try {
      const res = await fetch(`/api/budget/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      
      const prevBudgets = budgets
      const updatedBudgets = prevBudgets.filter((budget)=> budget._id != id)
      setBudgets(updatedBudgets);
      toast.success("Budget deleted successfully")
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { deleteBudget };
};
export default useDeleteBudget;
