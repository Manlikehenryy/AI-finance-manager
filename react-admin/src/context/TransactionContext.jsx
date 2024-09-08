import { createContext, useContext, useState } from "react";

export const TransactionContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTransactionContext = () => {
  return useContext(TransactionContext);
};

export const TransactionContextProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({
    page: 0,
    perPage: 0,
    total: 0,
    pageCount: 0,
    nextPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  return (
    <TransactionContext.Provider
      value={{ transactions, setTransactions, meta, setMeta }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
