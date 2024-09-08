import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa'
import './audioPlayer.css';

interface prop{
  audioSrc:string
}

const VoiceMessagePlayer:React.FC<prop> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
 
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0); 
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;

    if (!audio || !audio.duration) return;

    const newTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * audio.duration;
    audio.currentTime = newTime;
  };

  const handleSpeedChange = () => {
    const audio = audioRef.current;

    if (!audio) return;

    const newSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(newSpeed);
    audio.playbackRate = newSpeed;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2,'0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="voice-message-player">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="controls">
        <button onClick={togglePlay}>
          {isPlaying ? <FaPause/> : <FaPlay/>}
        </button>

        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress" style={{ width:`${progress}%`}}></div>
        </div>

        <div className="time">
          {formatTime(currentTime)}
        </div>

        <button onClick={handleSpeedChange}>
          {speed}x
        </button>
      </div>
    </div>
  );
};

export default VoiceMessagePlayer;
