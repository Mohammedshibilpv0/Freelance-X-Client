import  { useState } from 'react';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    setMessage('');
  };

  return (
    <div className="p-4 border-t">
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
