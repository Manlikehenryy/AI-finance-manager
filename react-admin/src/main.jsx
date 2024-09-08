import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";

import { BrowserRouter } from "react-router-dom";
import { TransactionContextProvider } from "./context/TransactionContext.jsx";
import { BudgetContextProvider } from "./context/BudgetContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <BudgetContextProvider>
        <TransactionContextProvider>
          <App />
        </TransactionContextProvider>
        </BudgetContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
