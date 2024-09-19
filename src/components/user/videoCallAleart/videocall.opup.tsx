import React, { useEffect, useState } from "react";
import { FaPhone, FaTimes } from "react-icons/fa";

interface VideoCallNotificationProps {
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const VideoCallNotification: React.FC<VideoCallNotificationProps> = ({ callerName, onAccept, onDecline }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setVisible(false);
    }, 60000); 


    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null; 

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Incoming Video Call</h2>
        <p className="text-lg mb-6">{callerName} is calling you</p>

        <div className="flex justify-around">
          <button
            onClick={onAccept}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            <FaPhone className="mr-2" />
            Accept
          </button>
          <button
            onClick={onDecline}
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            <FaTimes className="mr-2" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallNotification;
