import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Trash2 } from 'lucide-react';
import { socket } from '../../../socket/socket';
import { messageType } from './chatWindow';
import { IFriend } from '../../../pages/user/Chat';

interface props {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  receiverId: string 
  senderId: string
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  setFriends: React.Dispatch<React.SetStateAction<IFriend[]>>;
}

const WhatsAppVoiceRecorder: React.FC<props> = ({ isRecording, setIsRecording, receiverId, senderId, setMessages,setFriends }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  const cleanUp = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const startRecording = async () => {
    try {
      cleanUp();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      recorder.ondataavailable = (event: BlobEvent) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      cleanUp();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const sendAudio = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const uniqueNumber = "" + Date.now() + Math.random();
    const Data = {
      audio: audioBlob,
      senderId,
      receiverId,
      messageId: uniqueNumber
    };
    const message:messageType={
      messageId:uniqueNumber,
      sender:senderId,
      status:'sent',
      audio:audioUrl,
      timestamp: new Date(),
    }
    setFriends((prevFriends) =>
      prevFriends.map((users) =>
        users.id == receiverId
          ? { ...users, lastMessage:'Sent Voice message', updatedAt: new Date() }
          : users
      )
    );
    socket.emit('sendAudioMessage', Data);
    setMessages((prevMessages) => [...prevMessages, message]);
    setAudioChunks([]);
    setRecordingTime(0);
    setAudioUrl(null); 
  };

  const discardAudio = () => {
    setAudioChunks([]);
    setRecordingTime(0);
    setAudioUrl(null); 
  };

  useEffect(() => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      return () => {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);  
        }
      };
    }
  }, [audioChunks]);

  return (
    <div className="flex items-center justify-center ms-6 bg-gray-100 rounded-lg">
      <div className="relative mb-2 flex">
        <button
          onClick={toggleRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-10 mt-2 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          <Mic size={20} />
        </button>
        {isRecording && (
          <div className="ms-12  top-10 left-20 transform -translate-x-1/2 bg-white px-2 py-1 h-8 mt-3 rounded ">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>
      <div className="flex space-x-4 ms-6 me-2">
        {audioChunks.length > 0 && (
          <>
            <button
              onClick={sendAudio}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
            >
              <Send size={20} />
            </button>
            <button
              onClick={discardAudio}
              className="bg-red-500 hover:bg-red-600  text-white p-2 rounded-full"
            >
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WhatsAppVoiceRecorder;
