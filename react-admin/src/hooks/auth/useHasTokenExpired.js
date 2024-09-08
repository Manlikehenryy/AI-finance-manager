import toast from "react-hot-toast";
import useSignout from "./useSignout";

const useHasTokenExpired = () => {
  const { signout } = useSignout();

  const hasTokenExpired = async () => {
    try {
      const res = await fetch(`/api/auth/has-token-expired`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      if (data.message == "Session has expired") {
        await signout();

        toast.error("Your session has timed out, please login again");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { hasTokenExpired };
};

export default useHasTokenExpired;
