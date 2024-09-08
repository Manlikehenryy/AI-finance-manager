import Header from "../components/common/Header";
import BudgetsTable from "../components/budgets/BudgetsTable";
import Modal from "../components/common/Modal";
import { useState } from "react";
import useCreateBudget from "../hooks/budgets/useCreateBudget";

const BudgetsPage = () => {
  const [inputs, setInputs] = useState({
    category: "",
    allocatedAmount: 0,
    spentAmount: 0,
    startDate: "",
    endDate: "",
  });
  const { loading, createBudget } = useCreateBudget();

  const openModal = () => {
    document.getElementById("create_budget_modal").showModal();
  };

  const closeModal = () => {
    document.getElementById("create_budget_modal").close();
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();

    await createBudget(inputs);
    setInputs({
      category: "",
      allocatedAmount: 0,
      spentAmount: 0,
      startDate: "",
      endDate: "",
    });
    closeModal();
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Budgets" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="mb-5">
          <button
            onClick={() => openModal()}
            className="bg-[#F59E0B] hover:bg-[#fdb436] text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Create Budget
          </button>
        </div>

        <BudgetsTable />
      </main>

      <Modal
        id="create_budget_modal"
        title="Create Budget"
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
  );
};
export default BudgetsPage;
