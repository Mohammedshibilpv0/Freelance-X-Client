import { useEffect, useRef, useState } from 'react';
import Store from '../../../store/store';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../api/user/AuthuserServices';
import { switchUserRole } from '../../../api/user/userServices';
import useShowToast from '../../../Custom Hook/showToaster';
import Loading from '../../../style/loading';

const ProfileButton = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = Store((state) => state.user);
  const { updateUser } = Store();
  const { clearUser } = Store();
  const navigate = useNavigate();
  const Toast = useShowToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logouthandle = () => {
    clearUser();
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const switchRole = async () => {
    let action = user.role === "Client" ? "Freelancer" : "Client";
    setIsLoading(true);
    const response = await switchUserRole(action, user.email);
    if (response.message) {
      setTimeout(() => {
        Toast(response.message, 'success', true);
        updateUser('role', action);
        setIsLoading(false);
        navigate('/');
      }, 3000);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex me-2" ref={dropdownRef}>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <Loading />
        </div>
      )}
      <div className="absolute top-1/2 right-[-1.5rem] transform -translate-y-1/2">
        <svg
          className={`transition-transform me-4 ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <button
        id="hs-dropdown-custom-trigger"
        type="button"
        className="relative inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none mr-4"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        aria-label="Dropdown"
        onClick={toggleDropdown}
      >
        <img
          className="w-full h-full rounded-full object-cover"
          src={user.profile ? user.profile : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'}
          alt="Avatar"
        />
        <span className="text-gray-600 font-medium truncate max-w-[7.5rem] absolute inset-0 flex items-center justify-center">
        </span>
      </button>

      <div
        className={`absolute right-0 mt-16 w-48 bg-white shadow-md rounded-lg p-1 space-y-0.5 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 hidden'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-dropdown-custom-trigger"
        style={{ zIndex: 10 }}
        onClick={toggleDropdown}
      >
        <Link to={'/profile'}>
          <span className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
            Profile
          </span>
        </Link>
        <span>
          <span className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 cursor-pointer" onClick={switchRole}>
            {`Switch to ${user.role === 'Client' ? 'Freelancer' : 'Client'}`}
          </span>
        </span>
        <hr />
        <span
          className="flex items-center gap-x-3.5 py-2 px-3 mt-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
          onClick={logouthandle}
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default ProfileButton;
