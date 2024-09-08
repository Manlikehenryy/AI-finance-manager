import { createContext, useContext, useState } from "react";

export const BudgetContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useBudgetContext = () => {
  return useContext(BudgetContext);
};

export const BudgetContextProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
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
    <BudgetContext.Provider value={{ budgets, setBudgets, meta, setMeta }}>
      {children}
    </BudgetContext.Provider>
  );
};
