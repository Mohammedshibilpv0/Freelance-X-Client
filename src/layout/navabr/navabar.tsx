import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiBell, FiLogIn, FiMenu } from 'react-icons/fi';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import ProfilButton from '../../components/user/profilebutton/profilButton';
import Store from '../../store/store';
import image from '../../assets/images/letter-f_14027513.png'
import { initializeSocket, socket } from '../../socket/socket';
import NotificationDropdown from '../../components/user/notification/notification';

interface NavItem {
  name: string;
  logo: JSX.Element;
  link: string;
}

const Navbar: React.FC = () => {
  const user = Store((config) => config.user);
  const addUsers = Store();
  const isLoggedIn = Store((config) => config.user.email !== '');
  const isAdmin = localStorage.getItem('AdminAccessToken');
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const id = user._id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); 
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const notifications = [
    { id: 1, message: "You have a new message from AAAAAAAAAAA" },
    { id: 2, message: "Your gig was approved" },
    { id: 3, message: "You received a new review" },
    { id: 4, message: "Payment was received" },
    { id: 5, message: "Reminder: Project deadline is tomorrow" },
    { id: 6, message: "Your account has been updated" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    if (isLoggedIn) {
      initializeSocket();
      socket.emit('addUser', id);
      const handleGetUser = (users: any) => {
        addUsers.updateUser('users', users);
      };

      const handleRemoveUser = (users: any) => {
        const lastSeen = new Date().toISOString();
        addUsers.updateUser('lastSeen', lastSeen);
        addUsers.updateUser('users', users);
      };

      socket.on('getUser', handleGetUser);
      socket.on('removeUser', handleRemoveUser);

      return () => {
        socket.off('getUser', handleGetUser);
        socket.off('removeUser', handleRemoveUser);
      };
    }
  }, [isLoggedIn]);

  const userNavItems: NavItem[] = [
    { name: "Dashboard", logo: <FiGrid className="me-2 icon" />, link: '/' },
    { name: "Explore", logo: <FiBook className="me-2 icon" />, link: '/explore' },
    { name: "Message", logo: <FaRegMessage className="me-2 icon" />, link: '/message' },
    ...(user.role === "Freelancer"
      ? [{ name: "Create Gig", logo: <IoMdAddCircleOutline size={19} className="me-2 icon" />, link: '/freelancer/creategig' }]
      : [{ name: "Create Post", logo: <IoMdAddCircleOutline  size={19} className="me-2 icon" />, link: '/client/createpost' }]
    )
  ];

  const adminNavItems: NavItem[] = [
    { name: "Dashboard", logo: <FiGrid className="me-2 icon" />, link: '/admin/' },
    { name: "Manage User", logo: <FiBook className="me-2 icon" />, link: '/admin/manage-user' },
    { name: "Manage Category", logo: <FiBook className="me-2 icon" />, link: '/admin/manage-category' },
  ];

  const navItems = isAdminRoute ? adminNavItems : userNavItems;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('AdminAccessToken');
    localStorage.removeItem('AdminRefreshToken');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 w-full z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            <img className='h-9' src={image} alt="Logo" />
          </Link>
          <button className="md:hidden ml-4" onClick={toggleMenu}>
            <FiMenu size={24} />
          </button>
        </div>

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

        <div className="flex items-center relative">
          {!isAdminRoute && isLoggedIn ? (
            <>
              <button onClick={toggleNotification} className="px-3 py-2 mr-3 rounded-md text-gray-700 flex items-center hover:bg-gray-200">
                <FiBell size={19} className='mr-3' />
              </button>
             
              {isNotificationOpen && (
              <NotificationDropdown
              notifications={notifications}
              isNotificationOpen={isNotificationOpen}
              toggleNotification={toggleNotification}
            />
                  )}
              <ProfilButton />
            </>
          ) : !isAdminRoute ? (
            <Link to='/login' className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-200">
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

      {isMenuOpen && (
        <div className="md:hidden">
          {navItems.map((item, index) => (
           <>
            <Link
              key={index}
              to={item.link}
              className={`flex items-center px-4 py-2 ${location.pathname === item.link ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={toggleMenu}
            >
              {item.logo}
              {item.name}
            </Link>
            <hr />
           </>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
