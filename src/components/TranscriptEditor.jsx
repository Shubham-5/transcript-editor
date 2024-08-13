import { useState, useRef, useEffect } from "react";
import TranscriptWord from "./TranscriptWord";

function TranscriptEditor({ initialTranscript }) {
  const [transcript, setTranscript] = useState(initialTranscript);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(null);

  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearAllTimers();
      setCurrentWordIndex(null);
    } else {
      setIsPlaying(true);
      transcript.forEach((wordObj, index) => {
        const startTimer = setTimeout(() => {
          setCurrentWordIndex(index);
        }, wordObj.start_time);

        const endTimer = setTimeout(() => {
          setCurrentWordIndex((prevIndex) =>
            prevIndex === index ? null : prevIndex
          );
          if (index === transcript.length - 1) {
            setIsPlaying(false);
          }
        }, wordObj.start_time + wordObj.duration);

        timersRef.current.push(startTimer, endTimer);
      });
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={handlePlay}
        className={`mb-4 px-4 py-2 rounded ${
          isPlaying ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>

      <div className="border p-4 rounded">
        {transcript.map((wordObj, index) => (
          <TranscriptWord
            key={`${wordObj + index}`}
            transcript={transcript}
            setTranscript={setTranscript}
            currentWordIndex={currentWordIndex}
            wordObj={wordObj}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default TranscriptEditor;
