import { useEffect, useState, useRef } from 'react';
import { FaArrowLeft, FaArrowDown } from 'react-icons/fa';
import Store from '../../../store/store';
import { socket } from '../../../socket/socket';
import { getMessage } from '../../../api/user/userServices';
import moment from 'moment';

interface ChatWindowProps {
  chat: { id: string; firstName: string; lastName: string; conversationId: string };
  goBack: () => void;
  openUser: string | null; 
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, goBack, openUser }) => {
  console.log(chat)
  const userId = Store((config) => config.user._id) as string;
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: Date; displayDate?: string }[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setReceiverId(openUser);
  }, [openUser]);

  useEffect(() => {
    const fetchChat = async (conversationId: string) => {
      try {
        const response = await getMessage(conversationId);
        if (response && response.messages) {
          setMessages(response.messages);
        }
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };

    fetchChat(chat.conversationId);

    console.log('messsage',receiverId)
    const handleMessage = (message: { sender: string; text: string; timestamp: Date }) => {
      if (message.sender === receiverId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('messageContent', handleMessage);

    return () => {
      socket.off('messageContent', handleMessage);
    };
  }, [receiverId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 100); 
    }
  };

  const handleScrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShowScrollButton(false); 
    }
  };

  const handleSubmission = () => {
    if (text.trim() && receiverId) {
      const message = {
        sender: userId,
        text,
        timestamp: new Date(),
      };

      socket.emit('message', { senderId: userId, text, receiverId, timestamp: new Date() });
      setMessages((prevMessages) => [...prevMessages, message]);
      setText('');
    }
  };

  const formatDate = (date: Date) => {
    const now = moment();
    const msgDate = moment(date);
    if (now.isSame(msgDate, 'day')) return 'Today';
    if (now.subtract(1, 'day').isSame(msgDate, 'day')) return 'Yesterday';
    return msgDate.format('MMMM Do YYYY');
  };

  const getMessageDate = () => {
    let lastDate = '';
    return messages.map((msg) => {
      const date = moment(msg.timestamp).format('YYYY-MM-DD');
      const displayDate = date !== lastDate ? formatDate(msg.timestamp) : '';
      lastDate = date;
      return { ...msg, displayDate };
    });
  };

  const formattedMessages = getMessageDate();

  return (
    <div className="flex flex-col h-screen" style={{ height: 'calc(100vh - 70px)' }}>
      <div className="bg-gray-100 border-b p-4 flex items-center">
        <button onClick={goBack} className="text-gray-600 mr-4">
          <FaArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
            <span className="text-gray-600 text-lg font-semibold">
              {chat.firstName[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{chat.firstName} {chat.lastName}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-auto p-4"
        onScroll={handleScroll}
      >
        {formattedMessages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.sender === userId ? 'text-right' : 'text-left'}`}>
            {msg.displayDate && (
              <div className="text-center text-gray-500 my-2">{msg.displayDate}</div>
            )}
            <div
              className={`inline-block p-3 rounded-lg ${msg.sender === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              style={{ maxWidth: '350px' }}
            >
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {moment(msg.timestamp).format('h:mm a')}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
  
  {showScrollButton && (
    <button
      onClick={handleScrollToBottom}
      className="absolute bottom-4 me-4 right-4 w-12 h-12 bg-gray-500 text-white rounded-full flex items-center justify-center shadow-md"
    >
      <FaArrowDown size={20} />
    </button>
  )}
</div>

      <div className="border-t p-4 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmission();
            }
          }}
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg"
        />

      </div>
    </div>
  );
};

export default ChatWindow;
