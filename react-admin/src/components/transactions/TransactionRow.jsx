import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import useUpdateTransaction from "../../hooks/transactions/useUpdateTransaction";
import Modal from "../common/Modal";

const TransactionRow = ({ transaction, deleteTrans }) => {
  const [inputs, setInputs] = useState({
    id: transaction._id,
    category: transaction.category,
    amount: transaction.amount,
    transactionDate: transaction.transactionDate.split("T")[0] || "",
    type: transaction.type,
    description: transaction.description,
  });
  const { loading, updateTransaction } = useUpdateTransaction();

  const openModal = () => {
    document
      .getElementById(`update_transaction_modal-${transaction._id}`)
      .showModal();
  };

  const closeModal = () => {
    document
      .getElementById(`update_transaction_modal-${transaction._id}`)
      .close();
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    await updateTransaction(inputs);

    closeModal();
  };

  return (
    <>
      <motion.tr
        key={transaction._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center`}
        >
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              transaction.type === "income"
                ? "bg-green-800 text-green-100"
                : "bg-red-800 text-red-100"
            }`}
          >
            {`${transaction.type
              .slice(0, 1)
              .toUpperCase()}${transaction.type.slice(1)}`}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {`${transaction.category
            .slice(0, 1)
            .toUpperCase()}${transaction.category.slice(1)}`}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${transaction.amount.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {transaction.description}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          {transaction.transactionDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          <button
            onClick={() => openModal()}
            className="text-indigo-400 hover:text-indigo-300 mr-2"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => deleteTrans(transaction._id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </motion.tr>

      <div>
        <Modal
          id={`update_transaction_modal-${transaction._id}`}
          title="Update Transaction"
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
                  onChange={(e) =>
                    setInputs({ ...inputs, type: e.target.value })
                  }
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
    </>
  );
};

export default TransactionRow;
