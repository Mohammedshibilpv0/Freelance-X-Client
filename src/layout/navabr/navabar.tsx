import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiBell, FiLogIn } from 'react-icons/fi';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import ProfilButton from '../../components/user/profilebutton/profilButton';
import Store from '../../store/store';


interface NavItem {
  name: string;
  logo: JSX.Element;
  link: string;
}

const Navbar: React.FC = () => {
  const user=Store((config)=>config.user)
  const isLoggedIn = Store((config)=>config.user.email!=='')
  const isAdmin = localStorage.getItem('AdminAccessToken');
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  

  const userNavItems: NavItem[] = [
    { name: "Dashboard", logo: <FiGrid className="me-2 icon" />, link: '/' },
    { name: "Explore", logo: <FiBook className="me-2 icon" />, link: '/explore' },
    { name: "Message", logo: <FaRegMessage className="me-2 icon" />, link: '/message' },
    { name: "Notifications", logo: <FiBell className="me-2 icon" />, link: '/notifications' },
  ];

  const adminNavItems: NavItem[] = [
    { name: "Dashboard", logo: <FiGrid className="me-2 icon" />, link: '/admin/' },
    { name: "Manage User", logo: <FiBook className="me-2 icon" />, link: '/admin/manage-user' },
    { name: "Manage Category", logo: <FiBook className="me-2 icon" />, link: '/admin/manage-category' },
  ];

  const navItems = isAdminRoute ? adminNavItems : userNavItems;
  const navigate=useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('AdminAccessToken');
    localStorage.removeItem('AdminRefreshToken');
    navigate('/admin/login')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 w-full z-10 ">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Logo
        </Link>

        <div className="hidden md:flex space-x-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.link ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              {item.logo}
              {item.name}
            </Link>
          ))}
        </div>

  <div className="flex items-center ">
  {!isAdminRoute && isLoggedIn ? (
    <>
      {user.role === "Freelancer" ? (
        <Link to={'/freelancer/creategig'} className="px-3 py-2  mr-2 rounded-md text-gray-700 flex items-center hover:bg-gray-200">
          <IoMdAddCircleOutline size={'27'} className="mr-2" />
          Create Gig
        </Link>
      ) : (
        <Link to={'/client/createpost'} className="flex  px-3 py-2 mr-2 rounded-md text-gray-700  items-center hover:bg-gray-200">
          <IoMdAddCircleOutline size={'27'} className="mr-2" />
          Create Post
        </Link>
      )}
      <ProfilButton />
    </>
  ) : !isAdminRoute ? (
    <Link to={'/login'} className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-200">
      <FiLogIn className="mr-2" />
      Login
    </Link>
  ) : null}

  {isAdminRoute && isAdmin && (
    <p className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
      <FiLogIn className="mr-2" />
      Logout
    </p>
  )}
</div>

      </div>
    </nav>
  ); 
};

export default Navbar;
