import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, isToday } from 'date-fns'; 
import Store from '../../../store/store';
import { socket } from '../../../socket/socket';
import { myNotifications } from '../../../api/user/userServices';
import useShowToast from '../../../Custom Hook/showToaster';

export interface INotification{
  _id?:string
  link?:string
  senderId?:string,
  reciverId?:string,
  message:string,
  time?:Date,
  read:boolean
  messageCount?: number
  type:'message'|'payment'|'job'
}


interface NotificationDropdownProps {
  isNotificationOpen: boolean;
  toggleNotification: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isNotificationOpen,
  toggleNotification
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const userId = Store((config) => config.user._id);
  const Toast= useShowToast()
  useEffect(() => {
    const handleNotification = (data: INotification) => {
      setNotifications((prev) => {
        const updatedNotifications = [...prev, data];
        return updatedNotifications.sort(
          (a, b) => new Date(b.time!).getTime() - new Date(a.time!).getTime()
        );
      });
      
      Toast(data.message,'success',true)
    };
    
    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification); 
    };
  }, []);

  useEffect(() => {
    async function fetchNotification() {
      const response = await myNotifications(userId);
      setNotifications((prev) => [...prev, ...response]);
    }

    fetchNotification();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        toggleNotification();
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
  }, [isNotificationOpen, toggleNotification]);

  const formatNotificationTime = (timestamp: string | undefined | Date) => {
    if (!timestamp) {
      return 'Invalid time'; 
    }
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return 'Invalid time'; 
    }
  
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'd MMM y');
    }
  };
  

  const markAsRead = (notificationId: string | undefined) => {
    if (!notificationId) return;

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === notificationId ? { ...notification, read: true } : notification
      )
    );

    socket.emit('markNotificationAsRead', { notificationId, userId });
  };

  return (
    <>
      {isNotificationOpen && (
        <div
          ref={notificationRef}
          className="absolute right-0 mt-[400px] w-80 bg-white shadow-lg rounded-lg overflow-hidden z-20"
        >
          <div className="h-80 overflow-y-auto scrollbar-hide">
            <h1 className="text-center text-white text-lg font-semibold p-3 bg-blue-400 sticky top-0 z-10">
              Notifications
            </h1>
            {notifications.length ? (
              notifications.map((notification) => (
                <React.Fragment key={notification._id}>
                  <Link
                    to={notification.link ?? '/'}
                    onClick={() => markAsRead(notification._id)} 
                  >
                    <div
                      className={`px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer ${
                        notification.read
                          ? 'text-gray-700'
                          : 'bg-blue-100 text-blue-700 font-bold' 
                      }`}
                    >
                      {notification.message}
                      <span className="block text-xs text-gray-500">
                        {formatNotificationTime(notification.time)}
                      </span>
                    </div>
                  </Link>
                  <hr />
                </React.Fragment>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-700 text-center">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationDropdown;
