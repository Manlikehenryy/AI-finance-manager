import { useAuthContext } from "../../context/AuthContext";
import useSignout from "../../hooks/auth/useSignout";

const Header = ({ title }) => {
  const { signout } = useSignout();
  const {authUser} = useAuthContext();

  const signOut = async () => {
    await signout();
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700  relative z-[10]">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center ">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#fdb436] to-[#F59E0B] flex items-center justify-center text-white font-semibold'>
												{`${authUser.firstName.charAt(0) || ''}`}
											</div>
										</div>
          </div>
          <ul
            tabIndex={0}
            className="menu text-gray-900 menu-sm dropdown-content bg-base-100 rounded-box  mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Settings</a>
            </li>

            <li>
              <a onClick={signOut}>Sign Out</a>
            </li>
          </ul>
        </div>
      </div>

      {/* 
      <div className="flex-none gap-2">
       
      </div> */}
    </header>
  );
};
export default Header;
