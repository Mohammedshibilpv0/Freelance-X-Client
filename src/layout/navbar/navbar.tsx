import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiBell, FiLogIn, FiMenu } from 'react-icons/fi';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import ProfilButton from '../../components/user/profilebutton/profilButton';
import Store from '../../store/store';
import image from '../../assets/images/letter-f_14027513.png'
import { initializeSocket, socket } from '../../socket/socket';
import NotificationDropdown, { INotification } from '../../components/user/notification/notification';
import useShowToast from '../../Custom Hook/showToaster';
import VideoCallNotification from '../../components/user/videoCallAleart/videocall.opup';
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
  const [incomingCall, setIncomingCall] = useState(false);
  const [receiverId,setReceiverId]=useState('')
  // const [conversationId,setConversationId]=useState('')
  const [name,setName]=useState('')
  const notificationRef = useRef<HTMLDivElement>(null);
  const Toast= useShowToast()
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };



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

      const handleNotification = (data: INotification) => {
        Toast(data.message,'success',true)
      };
      socket.on('notification', handleNotification);
  

      

      socket.on('getUser', handleGetUser);
      socket.on('declineVideoCall',(data)=>{
        Toast(data.name,'error',true)
      })
      socket.on('videocallAlert',(data)=>{
       setReceiverId(data.senderId)
       setIncomingCall(true)
      //  setConversationId(data.conversatioId)
       setName(data.name)
      })
      socket.on('removeUser', handleRemoveUser);

      return () => {
        socket.off('getUser', handleGetUser);
        socket.off('removeUser', handleRemoveUser);
        socket.off('notification', handleNotification); 

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
    { name: "User Posts", logo: <FiBook className="me-2 icon" />, link: '/admin/userposts' },
    { name: "Freelancer Gigs", logo: <FiBook className="me-2 icon" />, link: '/admin/freelancergigs' },
    { name: "Report", logo: <FiBook className="me-2 icon" />, link: '/admin/manage-reports' }
  ];

  const navItems = isAdminRoute ? adminNavItems : userNavItems;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('AdminAccessToken');
    localStorage.removeItem('AdminRefreshToken');
    navigate('/admin/login');
  };

  const onAccept = async ()=>{
    navigate('/message')
    setIncomingCall(false)
  }

 

  const onDecline = ()=>{
    socket.emit('videoDecline',{senderId:id,receiverId,name:`${user.firstName} ${user.secondName} declined your call`})
    setIncomingCall(false)
    setName('')
    setReceiverId('')
  }

  return (
    <nav className="bg-white shadow-sm  sticky top-0 w-full z-10">
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
      {incomingCall &&(
        <VideoCallNotification callerName={name??''} onDecline={onDecline} onAccept={onAccept}/>
      )}

   
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
