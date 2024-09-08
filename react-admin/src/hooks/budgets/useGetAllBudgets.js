import toast from "react-hot-toast";
import { useBudgetContext } from "../../context/BudgetContext";

const useGetAllBudgets = () => {
  const { setBudgets, setMeta } = useBudgetContext();

  const getAllBudgets = async (page, limit) => {
    try {
      const res = await fetch(`/api/budget?page=${page}&limit=${limit}`, {
        method: "GET",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      setBudgets(data.data);
      setMeta(data.meta)
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { getAllBudgets };
};
export default useGetAllBudgets;
