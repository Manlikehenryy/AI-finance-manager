import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const useSignout = () => {
  const { setAuthUser } = useAuthContext();

  const signout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.removeItem("finance-manager");
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { signout };
};
export default useSignout;
