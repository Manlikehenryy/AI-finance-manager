import Header from "../components/common/Header";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/transactions/SalesTrendChart";
import TransactionsTable from "../components/transactions/TransactionsTable";
import Modal from "../components/common/Modal";
import { useEffect, useState } from "react";
import useCreateTransaction from "../hooks/transactions/useCreateTransaction";
import useGetAllTransactions from "../hooks/transactions/useGetAllTransactions";

const TransactionsPage = () => {
  const [inputs, setInputs] = useState({
    category: "",
    amount: 0,
    transactionDate: "",
    type: "",
    description: "",
  });
  const { loading, createTransaction } = useCreateTransaction();
  const { getAllTransactions } = useGetAllTransactions();

  const openModal = () => {
    document.getElementById("create_transaction_modal").showModal();
  };

  const closeModal = () => {
    document.getElementById("create_transaction_modal").close();
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    await createTransaction(inputs);
    setInputs({
      category: "",
      amount: 0,
      transactionDate: "",
      type: "",
      description: "",
    });
    closeModal();
  };

 

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Transactions" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="mb-5">
          <button
            onClick={() => openModal()}
            className="bg-[#F59E0B] hover:bg-[#fdb436] text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
          >
            Create Transaction
          </button>
        </div>

        <TransactionsTable />

      </main>

      <Modal
        id="create_transaction_modal"
        title="Create Transaction"
        onClose={closeModal}
        onSubmit={handleTransactionSubmit}
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
              htmlFor="Amount"
              className="block text-sm font-medium leading-6"
            >
              Amount
            </label>
            <div className="mt-2">
              <input
                id="Amount"
                name="Amount"
                type="number"
                required
                autoComplete="Amount"
                className="input input-bordered block w-full rounded-md  py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                value={inputs.amount}
                onChange={(e) =>
                  setInputs({ ...inputs, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-2">
            <label
              htmlFor="Transaction Date"
              className="block text-sm font-medium leading-6"
            >
              Transaction Date
            </label>
            <div className="mt-2">
              <input
                id="TransactionDate"
                name="TransactionDate"
                type="date"
                required
                autoComplete="Transaction Date"
                className="input input-bordered block w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                value={inputs.transactionDate}
                onChange={(e) =>
                  setInputs({ ...inputs, transactionDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-2">
            <label
              htmlFor="Transaction Type"
              className="block text-sm font-medium leading-6"
            >
              Transaction Type
            </label>
            <div className="mt-2">
              <select
                id="TransactionType"
                name="TransactionType"
                required
                autoComplete="Transaction Type"
                className="input input-bordered block w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                value={inputs.type}
                onChange={(e) => setInputs({ ...inputs, type: e.target.value })}
              >
                <option value="">Select Transaction Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="mt-2">
            <label
              htmlFor="Description"
              className="block text-sm font-medium leading-6"
            >
              Description
            </label>
            <div className="mt-2">
              <input
                id="Description"
                name="Description"
                type="text"
                autoComplete="Description"
                className="input input-bordered block w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                value={inputs.description}
                onChange={(e) =>
                  setInputs({ ...inputs, description: e.target.value })
                }
              />
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};
export default TransactionsPage;
