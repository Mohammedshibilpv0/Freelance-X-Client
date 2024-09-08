import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  notifications: { id: number; message: string }[];
  isNotificationOpen: boolean;
  toggleNotification: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isNotificationOpen,
  toggleNotification
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
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

  return (
    <>
   
      {isNotificationOpen && (
        <div ref={notificationRef} className="absolute right-0 mt-[400px] w-80 bg-white shadow-lg rounded-lg overflow-hidden z-20">
          <div className="max-h-80 overflow-y-auto scrollbar-hide">
            <h1 className="text-center text-white text-lg font-semibold p-3 bg-blue-400 sticky top-0 z-10">
              Notifications
            </h1>
            {notifications.length ? (
              notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <Link to={'/explore'}>
                    <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      {notification.message}
                    </div>
                  </Link>
                  <hr />
                </React.Fragment>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-700">
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
