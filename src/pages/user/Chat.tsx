// import { useEffect, useState } from 'react';
// import Sidebar from '../../components/user/chat/sidebar'; 
// import ChatWindow from '../../components/user/chat/chatWindow'; 
// import { socket } from '../../socket/socket';
// import { useLocation } from 'react-router-dom';
// import Store from '../../store/store';
// import { findMyFriends } from '../../api/user/userServices';

// export interface IFriend {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   onlineStatus?: boolean;
//   profilePictureUrl?: string;
//   conversationId?: string;
// }

// export interface Chat {
//   id: string;
//   firstName: string;
//   lastName: string;
//   conversationId: string;
// }

// const ChatPage = () => {
//   const myId = Store((config) => config.user._id);
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const id = searchParams.get('_id');
//   const firstName = searchParams.get('name1') || 'Unknown';
//   const lastName = searchParams.get('name2') || 'Unknown';
//   const [users, setUsers] = useState<IFriend[]>([]);
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [openedUser, setOpenedUser] = useState<string | null>(null);

//   useEffect(() => {
//     socket.emit('addUser', myId);

//     if (myId) {
//       const fetchUsers = async (myId: string) => {
//         try {
//           const data = await findMyFriends(myId);
//           if (data.list) {
//             setUsers((prevUsers) => {
//               const existingUserIds = new Set(prevUsers.map((user) => user.id));
//               const newUsers = data.list.friends.filter(
//                 (friend: IFriend) => !existingUserIds.has(friend.id)
//               );

//               return [...prevUsers, ...newUsers];
//             });
//           }
//         } catch (error) {
//           console.error('Failed to fetch friends:', error);
//         }
//       };

//       fetchUsers(myId);
//     }
//   }, [myId]);

 

//   const transformToChats = (friends: IFriend[]): Chat[] => {
//     return friends.map(friend => ({
//       id: friend.id,
//       firstName: friend.firstName || 'Unknown',
//       lastName: friend.lastName || 'Unknown',
//       conversationId: friend.conversationId || '',
//     }));
//   };

//   const handleSelectChat = (chat: Chat) => {
//     setSelectedChat(chat);
//     setOpenedUser(chat.id);
//   };

//   const goBack = () => {
//     setSelectedChat(null);
//     setOpenedUser(null);
//   };

//   return (
//     <div className="flex h-screen" style={{ height: 'calc(100vh - 70px)' }}>
//       <div className="flex flex-col md:flex-row w-full">
//         {/* Sidebar */}
//         <div className={`md:w-1/4 w-full bg-gray-100 border-r md:border-r-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
//           <Sidebar chats={transformToChats(users)} onSelectChat={handleSelectChat} />
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1">
//           {selectedChat ? (
//             <ChatWindow chat={selectedChat} goBack={goBack} openUser={openedUser} />
//           ) : (
//             <div className="flex items-center justify-center h-full md:hidden">
//               <p className="text-gray-500">Select a chat to start messaging</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



import { useEffect, useState } from 'react';
import Sidebar from '../../components/user/chat/sidebar'; 
import ChatWindow from '../../components/user/chat/chatWindow'; 
import { socket } from '../../socket/socket';
import { useLocation, useNavigate } from 'react-router-dom';
import Store from '../../store/store';
import { findMyFriends } from '../../api/user/userServices';

export interface IFriend {
  id: string;
  firstName?: string;
  lastName?: string;
  onlineStatus?: boolean;
  profilePictureUrl?: string;
  conversationId?: string;
  updatedAt?:string|Date
  lastMessage?:string
}

export interface Chat {
  id: string;
  firstName: string;
  lastName: string;
  conversationId: string;
  updatedAt?:string|Date
  lastMessage?:string
  status?:string
}

const ChatPage = () => {
  const myId = Store((config) => config.user._id);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('_id');
  const firstName = searchParams.get('name1') || 'Unknown';
  const lastName = searchParams.get('name2') || 'Unknown';
  const conversationId = searchParams.get('conversation') || '';

  const [users, setUsers] = useState<IFriend[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [openedUser, setOpenedUser] = useState<string | null>(null);

  useEffect(() => {
    socket.emit('addUser', myId);

    if (myId) {
      const fetchUsers = async (myId: string) => {
        try {
          const data = await findMyFriends(myId);
          if (data.list) {
            setUsers((prevUsers) => {
              const existingUserIds = new Set(prevUsers.map((user) => user.id));
              const newUsers = data.list.friends.filter(
                (friend: IFriend) => !existingUserIds.has(friend.id)
              );

              return [...prevUsers, ...newUsers];
            });
          }
        } catch (error) {
          console.error('Failed to fetch friends:', error);
        }
      };

      fetchUsers(myId);
    }
  }, [myId]);

  useEffect(() => {
    if (id && users.length > 0) {
      const userToOpen = users.find((user) => user.id === id);
      if (userToOpen) {
        handleSelectChat({
          id: userToOpen.id,
          firstName: userToOpen.firstName || 'Unknown',
          lastName: userToOpen.lastName || 'Unknown',
          conversationId: userToOpen.conversationId || conversationId,

        });
      }
    }
  }, [id, users]);

  const transformToChats = (friends: IFriend[]): Chat[] => {
    return friends.map(friend => ({
      id: friend.id,
      firstName: friend.firstName || 'Unknown',
      lastName: friend.lastName || 'Unknown',
      conversationId: friend.conversationId || '',
      lastMessage:friend.lastMessage,
      updatedAt:friend.updatedAt,
    }));
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setOpenedUser(chat.id);
  };

  const goBack = () => {
    setSelectedChat(null);
    setOpenedUser(null);
  };

  return (
    <div className="flex h-screen" style={{ height: 'calc(100vh - 70px)' }}>
      <div className="flex flex-col md:flex-row w-full">
        <div className={`md:w-1/4 w-full bg-gray-100 border-r md:border-r-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <Sidebar chats={transformToChats(users)} onSelectChat={handleSelectChat}/>
        </div>

        <div className="flex-1">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} goBack={goBack} openUser={openedUser} setFriends={setUsers} />
          ) : (
            <div className="flex items-center justify-center h-full md:hidden">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
