import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTransactionContext } from "../../context/TransactionContext";
import useDeleteTransactions from "../../hooks/transactions/useDeleteTransaction";
import TransactionRow from "./TransactionRow";
import useGetAllTransactions from "../../hooks/transactions/useGetAllTransactions";

const TransactionsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions, meta } = useTransactionContext();
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const { deleteTransaction } = useDeleteTransactions();
  const [page, setPage] = useState(1);
  const limit = 5;
  const { getAllTransactions } = useGetAllTransactions();

  useEffect(() => {
    getAllTransactions(page, limit);
  }, [page]);

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page < meta.pageCount) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const deleteTrans = async (id) => {
    await deleteTransaction(id);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = transactions.filter(
      (transaction) =>
        transaction.type.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.description.toLowerCase().includes(term)
    );

    setFilteredTransactions(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Transaction List
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Transaction Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction._id}
                transaction={transaction}
                deleteTrans={deleteTrans}
              />
            ))}
            {filteredTransactions && filteredTransactions?.length > 0 && (
              <div className="join mt-5">
                <button
                  disabled={!meta.hasPrevPage}
                  onClick={() => prevPage()}
                  className="join-item btn bg-gray-800 text-white"
                >
                  «
                </button>
                <button className="join-item btn bg-gray-800 text-white">
                  Page {page}
                </button>
                <button
                  disabled={!meta.hasNextPage}
                  onClick={() => nextPage()}
                  className="join-item btn bg-gray-800 text-white"
                >
                  »
                </button>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default TransactionsTable;
