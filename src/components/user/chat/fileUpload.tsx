import React, { useRef, useState } from 'react';
import { FaPaperclip, FaSpinner } from 'react-icons/fa';
import { socket } from '../../../socket/socket';
import { messageType } from './chatWindow';
import { postImage } from '../../../api/user/userServices';
import { IFriend } from '../../../pages/user/Chat';

interface FileUploaderProps {
  senderId: string;
  receiverId: string;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  setFriends: React.Dispatch<React.SetStateAction<IFriend[]>>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ senderId, receiverId, setMessages,setFriends }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSendFile = async () => {
    if (selectedFile && senderId && receiverId) {
      setIsLoading(true); 
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      try {
        const Data = await postImage(formData);
        const imageUrl = Data.data.url;
        const messageId = "" + Date.now() + Math.random();

        const fileMessage = {
          messageId,
          sender: senderId,
          file: imageUrl,
          timestamp: new Date(),
          status: 'sent',
        };

        socket.emit('sendFileMessage', { file: imageUrl, senderId, receiverId, messageId });
        setFriends((prevFriends) =>
          prevFriends.map((users) =>
            users.id == receiverId
              ? { ...users, lastMessage:'image', updatedAt: new Date() }
              : users
          )
        );
        setMessages((prevMessages) => [...prevMessages, fileMessage]);

        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="relative">
      <button onClick={triggerFileInput} className="text-gray-500 me-7 rounded-lg">
        <FaPaperclip size={20} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelection}
        accept="image/*, video/*, application/pdf"
      />

      {previewUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div
            className="relative  p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
           

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 z-10">
                <FaSpinner className="animate-spin text-white" size={40} />
              </div>
            )}

            {!isLoading && selectedFile && selectedFile.type.startsWith('image') && (
              <img src={previewUrl} alt="Selected File" className="max-w-full max-h-[80vh]" />
            )}

            {!isLoading && selectedFile && selectedFile.type.startsWith('video') && (
              <video src={previewUrl} controls className="max-w-full max-h-[80vh]" />
            )}

            {!isLoading && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSendFile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
