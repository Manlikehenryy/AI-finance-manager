import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import Modal from "../common/Modal";
import useUpdateBudget from "../../hooks/budgets/useUpdateBudget";

const BudgetRow = ({ budget, deleteBudg }) => {
  const [inputs, setInputs] = useState({
    id: budget._id,
    category: budget.category,
    allocatedAmount: budget.allocatedAmount,
    spentAmount: budget.spentAmount,
    startDate: budget.startDate.split("T")[0] || "",
    endDate: budget.endDate.split("T")[0] || "",
  });
  const { loading, updateBudget } = useUpdateBudget();

  const openModal = () => {
    document.getElementById(`update_budget_modal-${budget._id}`).showModal();
  };

  const closeModal = () => {
    document.getElementById(`update_budget_modal-${budget._id}`).close();
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);

    await updateBudget(inputs);

    closeModal();
  };

  return (
    <>
      <motion.tr
        key={budget._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {`${budget.category.slice(0, 1).toUpperCase()}${budget.category.slice(
            1
          )}`}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${budget.allocatedAmount.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${budget.spentAmount.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {budget.startDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {budget.endDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          <button
            onClick={() => openModal()}
            className="text-indigo-400 hover:text-indigo-300 mr-2"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => deleteBudg(budget._id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </motion.tr>

      <div>
        <Modal
          id={`update_budget_modal-${budget._id}`}
          title="Update Budget"
          onClose={closeModal}
          onSubmit={handleBudgetSubmit}
          loading={loading}
        >
          <>
            <div className="mt-2">
              <label
                htmlFor="Category"
                className="block text-sm font-medium leading-6"
              >
                Category
              </label>
              <div className="mt-2">
                <input
                  id="Category"
                  name="Category"
                  type="text"
                  required
                  autoComplete="Category"
                  className="input input-bordered block w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={inputs.category}
                  onChange={(e) =>
                    setInputs({ ...inputs, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="Allocated Amount"
                className="block text-sm font-medium leading-6"
              >
                Allocated Amount
              </label>
              <div className="mt-2">
                <input
                  id="AllocatedAmount"
                  name="AllocatedAmount"
                  type="number"
                  required
                  autoComplete="Allocated Amount"
                  className="input input-bordered block w-full rounded-md  py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={inputs.allocatedAmount}
                  onChange={(e) =>
                    setInputs({ ...inputs, allocatedAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="Spent Amount"
                className="block text-sm font-medium leading-6"
              >
                Spent Amount
              </label>
              <div className="mt-2">
                <input
                  id="SpentAmount"
                  name="SpentAmount"
                  type="number"
                  autoComplete="Spent Amount"
                  className="input input-bordered block w-full rounded-md  py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={inputs.spentAmount}
                  onChange={(e) =>
                    setInputs({ ...inputs, spentAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="Start Date"
                className="block text-sm font-medium leading-6"
              >
                Start Date
              </label>
              <div className="mt-2">
                <input
                  id="StartDate"
                  name="StartDate"
                  type="date"
                  required
                  autoComplete="Start Date"
                  className="input input-bordered block w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={inputs.startDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, startDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="End Date"
                className="block text-sm font-medium leading-6"
              >
                End Date
              </label>
              <div className="mt-2">
                <input
                  id="EndDate"
                  name="EndDate"
                  type="date"
                  required
                  autoComplete="End Date"
                  className="input input-bordered block w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  value={inputs.endDate}
                  onChange={(e) =>
                    setInputs({ ...inputs, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        </Modal>
      </div>
    </>
  );
};

export default BudgetRow;
