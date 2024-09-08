import React, { useEffect, useState } from 'react';
import Store from '../../../store/store';
import moment from 'moment';
import { CiImageOn } from "react-icons/ci";
import { FiMic } from "react-icons/fi";
import { socket } from '../../../socket/socket';

interface Chat {
  id: string;
  firstName: string;
  lastName: string;
  conversationId: string;
  updatedAt?: string | Date;
  lastMessage?: string;
  status?: string;
}

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onSelectChat }) => {
  const users = Store((state) => state.user.users);
  const lastSeen = Store((state) => state.user.lastSeen);

  const [chatStatuses, setChatStatuses] = useState<{ [conversationId: string]: string }>({});

  useEffect(() => {
    socket.on('changestatus', (data: { conversationId: string; type: string }) => {
      setChatStatuses((prevStatuses) => ({
        ...prevStatuses,
        [data.conversationId]: data.type
      }));
    });

    return () => {
      socket.off('changestatus');
    };
  }, []);

  const formatLastSeen = (lastSeenTime: string | undefined | Date) => {
    const now = moment();
    const lastSeenMoment = moment(lastSeenTime);

    if (lastSeenMoment.isSame(now, 'day')) {
      return `Today at ${lastSeenMoment.format('h:mm A')}`;
    } else if (lastSeenMoment.isSame(now.subtract(1, 'day'), 'day')) {
      return `Yesterday at ${lastSeenMoment.format('h:mm A')}`;
    } else {
      return lastSeenMoment.format('MMMM Do [at] h:mm A');
    }
  };

  const formatLastMessageTime = (messageTime: string | undefined | Date) => {
    const now = moment();
    const messageMoment = moment(messageTime);

    if (messageMoment.isSame(now, 'day')) {
      return messageMoment.format('h:mm A');
    } else if (messageMoment.isSame(now.subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else {
      return messageMoment.format('MMMM D');
    }
  };

  const sortedChats = chats.sort((a, b) => {
    const dateA = new Date(a.updatedAt || 0).getTime();
    const dateB = new Date(b.updatedAt || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="w-full bg-gray-100 border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <ul className="mt-3">
        {sortedChats.map((chat) => {
          const isOnline = users.some((user: any) => user.id === chat.id);

          return (
            <li
              key={chat.id}
              className="p-4 hover:bg-gray-200 cursor-pointer"
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">
                  {chat.firstName} {chat.lastName}
                </div>
                <div
                  className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {isOnline ? 'Online' : `Last seen: ${formatLastSeen(lastSeen)}`}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {chatStatuses[chat.conversationId] === 'typing...' ? (
                  <span className="text-green-500">Typing...</span>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {chat.lastMessage?.startsWith('image') && <CiImageOn className="mt-3" />}
                      {chat.lastMessage?.startsWith('Sent Voice') && <FiMic className="mt-3" />}
                      <span className="truncate w-32 mt-2">
                        {chat.lastMessage?.replace('image:', '').replace('voice:', '')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatLastMessageTime(chat.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
        <hr />
      </ul>
    </div>
  );
};

export default Sidebar;
