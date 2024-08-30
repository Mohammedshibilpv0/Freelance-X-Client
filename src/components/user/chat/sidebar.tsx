import React from 'react';

interface Chat {
  id: string;
  firstName: string;
  lastName: string;
  conversationId: string;
}

interface SidebarProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="w-full m bg-gray-100 border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <ul className="mt-3">
        {chats.map(chat => (
          <li
            key={chat.id}
            className="p-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelectChat(chat)}
          >
            <div className="font-semibold">{chat.firstName} {chat.lastName}</div>
          </li>
        ))}
        <hr />
      </ul>
    </div>
  );
};

export default Sidebar;
