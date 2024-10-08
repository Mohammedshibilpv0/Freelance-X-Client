import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Trash2 } from 'lucide-react';
import { socket } from '../../../socket/socket';
import { messageType } from './chatWindow';
import { IFriend } from '../../../pages/user/Chat';

interface Props {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  receiverId: string;
  senderId: string;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  setFriends: React.Dispatch<React.SetStateAction<IFriend[]>>;
}

const WhatsAppVoiceRecorder: React.FC<Props> = ({
  isRecording,
  setIsRecording,
  receiverId,
  senderId,
  setMessages,
  setFriends,
}) => {
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
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setMediaRecorder(null);
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
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }
      };

      recorder.onerror = (event) => {
        console.error('Recording error:', event);
        cleanUp();
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
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
    if (!audioChunks.length) {
      alert('No audio recorded.');
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const uniqueNumber = `${Date.now()}${Math.random()}`;
    const audioUrl = URL.createObjectURL(audioBlob); // Create URL immediately before sending
    setAudioUrl(audioUrl); // Update audioUrl state for immediate feedback

    // Message data to be sent through socket
    const data = {
      audio: audioBlob,
      senderId,
      receiverId,
      messageId: uniqueNumber,
    };

    // Message structure to update the UI
    const message: messageType = {
      messageId: uniqueNumber,
      sender: senderId,
      status: 'sent',
      audio: audioUrl, // Use the local URL for immediate playback
      timestamp: new Date(),
    };

    // Update friend list to reflect the sent message
    setFriends((prevFriends) =>
      prevFriends.map((users) =>
        users.id === receiverId
          ? { ...users, lastMessage: 'Sent Voice message', updatedAt: new Date() }
          : users
      )
    );

    // Emit the audio message through socket
    socket.emit('sendAudioMessage', data);

    // Update messages state to include the new message immediately
    setMessages((prevMessages) => [...prevMessages, message]);

    // Reset audio chunks and URL after sending
    discardAudio();
  };

  const discardAudio = () => {
    setAudioChunks([]);
    setRecordingTime(0);
    setAudioUrl(null);
  };

  return (
    <div className="flex items-center justify-center ms-6 bg-gray-100 rounded-lg">
      <div className="relative mb-2 flex">
        <button
          onClick={toggleRecording}
          className={`w-10 mt-2 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          <Mic size={20} />
        </button>
        {isRecording && (
          <div className="ms-12 top-10 left-20 transform -translate-x-1/2 bg-white px-2 py-1 h-8 mt-3 rounded">
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
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
      {audioUrl && (
        <audio controls src={audioUrl} className="mt-4">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default WhatsAppVoiceRecorder;
