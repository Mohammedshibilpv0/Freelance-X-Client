import { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowDown, FaVideo } from "react-icons/fa";
import Store from "../../../store/store";
import { socket } from "../../../socket/socket";
import { getMessage } from "../../../api/user/userServices";
import moment from "moment";
import useShowToast from "../../../Custom Hook/showToaster";
import notificationSound from "../../../assets/audio/mixkit-correct-answer-tone-2870.wav";
import AudioMessage from "./audioButton";
import { IFriend } from "../../../pages/user/Chat";
import VoiceMessagePlayer from "./audioPlayer";
import FileUploader from "./fileUpload";
import ImageModal from "./viewImage";
import ImageWithSkeleton from "./fileShowing";
import { debounce } from 'lodash'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APPID, SERVERSECRET } from "../../../utility/env";

interface ChatWindowProps {
  chat: {
    id: string;
    firstName: string;
    lastName: string;
    conversationId: string;
    status?:string
  };
  goBack: () => void;
  openUser: string | null;
  setFriends: React.Dispatch<React.SetStateAction<IFriend[]>>;
}

export interface messageType {
  sender: string;
  text?: string;
  audio?: any;
  file?: any;
  timestamp: Date;
  status: string;
  displayDate?: string;
  messageId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  goBack,
  openUser,
  setFriends,
}) => {
  const user=Store((config)=>config.user)
  const userId = Store((config) => config.user._id) as string;
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<messageType[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [typeConversation,setTypeConversation]=useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isInCall, setIsInCall] = useState(false);
  const Toast = useShowToast();
  const users = Store((state) => state.user.users);
  const lastSeen = Store((state) => state.user.lastSeen);

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
  }, [receiverId, chat.conversationId]);

  
  useEffect(() => {
    const handleTyping = (data: { type: string; conversationId: string }) => {
      setTypeConversation(conversationId)
      if (data.conversationId === chat.conversationId) {
        setIsTyping(data.type === 'typing...');
      }
    };
  
    socket.on('changestatus', handleTyping);
  
    return () => {
      socket.off('changestatus', handleTyping);
    };
  }, [chat.conversationId]);

  
  useEffect(() => {
    const handleMessage = (message: {
      sender: string;
      text: string;
      timestamp: Date;
      status: string;
      messageId: string;
    }) => {
      if (message.sender === receiverId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        socket.emit("messageRead", message.messageId);
        const audio = new Audio(notificationSound);
        audio.play();
      }
    };

    socket.on("messageContent", handleMessage);

    return () => {
      socket.off("messageContent", handleMessage);
    };
  }, [receiverId]);

  useEffect(() => {
    const handleMessageStatus = (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId == messageId ? { ...msg, status: "read" } : msg
        )
      );
    };

    socket.on("messageReadConfirmation", handleMessageStatus);

    return () => {
      socket.off("messageReadConfirmation", handleMessageStatus);
    };
  }, [messages]);

  useEffect(() => {
    if (receiverId) {
      const markAllAsRead = () => {
        const unreadMessages = messages.filter(
          (msg) => msg.status === "sent" && msg.sender !== userId
        );
        unreadMessages.forEach((msg) => {
          socket.emit("messageRead", msg.messageId);
        });
      };

      markAllAsRead();
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
    }
  };

  const handleSubmission = () => {
    if (text.trim() && receiverId) {
      const uniqueNumber = "" + Date.now() + Math.random();
      const message = {
        messageId: uniqueNumber,
        sender: userId,
        text,
        timestamp: new Date(),
        status: "sent",
      };
      socket.emit("message", {
        senderId: userId,
        text,
        receiverId,
        timestamp: new Date(),
        status: "sent",
        messageId: message.messageId,
      });
      setMessages((prevMessages) => [...prevMessages, message]);
      setFriends((prevFriends) =>
        prevFriends.map((users) =>
          users.id == receiverId
            ? { ...users, lastMessage: text, updatedAt: new Date() }
            : users
        )
      );
      socket.emit('sendNotification',{userId,receiverId,text:`You have new message from ${user.firstName} ${user.secondName}`,link:'/message'})
      setText("");
    }
  };

  const formatDate = (date: Date) => {
    const now = moment();
    const msgDate = moment(date);
    if (now.isSame(msgDate, "day")) return "Today";
    if (now.subtract(1, "day").isSame(msgDate, "day")) return "Yesterday";
    return msgDate.format("MMMM Do YYYY");
  };

  const getMessageDate = () => {
    let lastDate = "";
    return messages.map((msg) => {
      const date = moment(msg.timestamp).format("YYYY-MM-DD");
      const displayDate = date !== lastDate ? formatDate(msg.timestamp) : "";
      lastDate = date;
      return { ...msg, displayDate };
    });
  };

  const formattedMessages = getMessageDate();

  const isOnline = users.some((user: any) => user.id === chat.id);

  const formatLastSeen = (lastSeenTime: string | undefined) => {
    const now = moment();
    const lastSeenMoment = moment(lastSeenTime);

    if (lastSeenMoment.isSame(now, "day")) {
      return `Today at ${lastSeenMoment.format("h:mm A")}`;
    } else if (lastSeenMoment.isSame(now.subtract(1, "day"), "day")) {
      return `Yesterday at ${lastSeenMoment.format("h:mm A")}`;
    } else {
      return lastSeenMoment.format("MMMM Do YYYY [at] h:mm A");
    }
  };

  const handleDeleteMessage = (messageId: any) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.messageId !== messageId)
    );
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleRightClick = (event: any, messageId: any) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      messageId: messageId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleCopyMessage = (messageId: string | number) => {
    const messageObj = messages.find((msg) => msg.messageId === messageId);

    if (messageObj) {
      const messageText = messageObj.text;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(messageText ?? "")
          .then(() => {
            console.log("Message copied to clipboard:", messageText);
            Toast("Message copied to clipboard", "success", true);
          })
          .catch((err) => {
            console.error("Failed to copy message:", err);
          });
      } else {
        console.warn("Clipboard API is not available");
      }
    } else {
      console.warn("Message not found");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  const conversationId=chat.conversationId
  const stopTyping = debounce(() => {
    socket.emit('typing', { type: '', receiverId, conversationId });
  }, 2000);
  
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    emitTyping();
  
    stopTyping();
  };
  
  const emitTyping = () => {
    socket.emit('typing', { type: 'typing...', receiverId, conversationId });
  };

  const appID =Number(APPID)
  const serverSecret = SERVERSECRET
  const startVideoCall = async () => {
    try {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        chat.conversationId, 
        Date.now().toString(), 
        user.firstName 
      );
  
      const zp = ZegoUIKitPrebuilt.create(kitToken);
  
      zp.joinRoom({
        container: document.getElementById('video-call-container'),
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
    
        onJoinRoom: () => {
      
          socket.emit('videoCall', {
            senderId: userId,
            name: `${user.firstName} ${user.secondName}`,
            receiverId,
          });
        },
      });
  
      setIsInCall(true); 
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };
  
  
  
   
  

  return (
    <div
      className="flex flex-col h-screen"
      style={{ height: "calc(100vh - 70px)" }}
      onClick={closeContextMenu}
    >
       
    <div className="bg-gray-100 border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
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
            <h2 className="text-lg font-semibold">
              {chat.conversationId === typeConversation && isTyping ? (
                <div className="text-gray-500 text-sm mt-2">
                  {chat.firstName} is typing...
                </div>
              ) : (
                <>
                  {chat.firstName} {chat.lastName}
                </>
              )}
            </h2>
            <p className={`text-sm ${isOnline ? "text-green-600" : "text-gray-500"}`}>
              {isOnline ? "Online" : `Last seen: ${formatLastSeen(lastSeen)}`}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={startVideoCall}  
        className="text-gray-600 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        title="Start video call"
      >
        <FaVideo size={24} />
      </button>
      
    </div>
    {isInCall && (
        <div id="video-call-container" className="w-full h-full bg-gray-800"></div>
      )}



      <div ref={chatContainerRef} className="flex-1 overflow-auto p-4" onScroll={handleScroll}>
        {formattedMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === userId ? "text-right" : "text-left"
            }`}
          >
            {msg.displayDate && (
              <div className="text-center mb-2 text-gray-500 text-sm">
                {msg.displayDate}
              </div>
            )}

            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === userId && !msg.file && !msg.audio
                  ? "bg-green-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
              style={{ maxWidth: "350px", textAlign: "left" }}
              onContextMenu={
                msg.sender === userId
                  ? (e) => handleRightClick(e, msg.messageId)
                  : undefined
              }
            >
              {msg.text && <p>{msg.text}</p>}

              {msg.file && (
                <ImageWithSkeleton
                  src={msg.file}
                  alt="Image"
                  onClick={() => handleImageClick(msg.file)}
                />
              )}

              {msg.audio && <VoiceMessagePlayer audioSrc={msg.audio} />}
              {msg.sender === userId && (
                <span className="text-xs text-white ">
                  <span className="ms-2 flex justify-end">
                    {msg.status === "sent" ? "✓" : "✓✓"}
                  </span>
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-1">
              {moment(msg.timestamp).format("h:mm A")}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="absolute flex flex-col bg-white shadow-lg rounded-lg p-2"
          style={{
            top: contextMenu.y - 90,
            left: contextMenu.x - 210,
            zIndex: 1000,
          }}
        >
          <button
            className="px-4 py-2 text-red-500 hover:bg-gray-100 rounded-lg transition duration-300"
            onClick={() => handleDeleteMessage(contextMenu.messageId)}
          >
            Delete
          </button>
          <button
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition duration-300"
            onClick={() => handleCopyMessage(contextMenu.messageId ?? "")}
          >
            Copy
          </button>
        </div>
      )}

      {showScrollButton && (
        <button
          onClick={handleScrollToBottom}
          className="fixed bottom-20 right-4 p-2 bg-blue-500 text-white rounded-full"
        >
          <FaArrowDown />
        </button>
      )}

<div className="bg-gray-100 p-2 flex flex-col md:flex-row items-center">
  {!isRecording && (
    <input
      type="text"
      className="border p-2 rounded-lg w-full mb-2 md:mb-0 md:flex-1"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => handleText(e)}
    />
  )}

  {userId && receiverId && (
    <div className="flex items-center w-full md:w-auto justify-between md:space-x-2">
      {/* Voice and Attach Buttons */}
      <div className="flex items-center space-x-1">
        <AudioMessage
          setFriends={setFriends}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          receiverId={receiverId}
          senderId={userId}
          setMessages={setMessages}
        />

        <FileUploader
          setFriends={setFriends}
          senderId={userId}
          receiverId={receiverId ?? ""}
          setMessages={setMessages}
        />
      </div>

      {!isRecording &&(
        <button
        onClick={handleSubmission}
        className="bg-blue-500 text-white p-2 rounded-lg ml-auto"
      >
        Send
      </button>
      )}
    </div>
  )}
</div>

    </div>
  );
};

export default ChatWindow;
