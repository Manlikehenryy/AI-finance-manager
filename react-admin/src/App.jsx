import { Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import TransactionsPage from "./pages/TransactionsPage";
import SignIn from "./pages/SignIn";
import { useAuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import BudgetsPage from "./pages/BudgetsPage";
import useHasTokenExpired from "./hooks/auth/useHasTokenExpired";
import { useEffect } from "react";

function App() {
  const { authUser } = useAuthContext();
  const { hasTokenExpired } = useHasTokenExpired();

  useEffect(() => {
    async function isTokenExpired() {
      await hasTokenExpired();
    }

    if (authUser) {
      isTokenExpired();
    }
  }, [authUser]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-[0]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <OverviewPage /> : <Navigate to={"/signin"} />}
        />

        <Route
          path="/transactions"
          element={
            authUser ? <TransactionsPage /> : <Navigate to={"/signin"} />
          }
        />

        <Route
          path="/budgets"
          element={authUser ? <BudgetsPage /> : <Navigate to={"/signin"} />}
        />
       
        <Route
          path="/signin"
          element={authUser ? <Navigate to={"/"} /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/"} /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
