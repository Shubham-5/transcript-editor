import { useState, useRef, useEffect } from "react";

function TranscriptEditor({ initialTranscript }) {
  const [transcript, setTranscript] = useState(initialTranscript);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentWordIndex, setCurrentWordIndex] = useState(null);

  const timersRef = useRef([]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

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

  const handleWordClick = (index) => {
    setEditingIndex(index);
    setEditingText(transcript[index].word);
  };

  const handleInputChange = (e) => {
    setEditingText(e.target.value);
  };

  const handleInputSubmit = () => {
    const updatedTranscript = [...transcript];
    updatedTranscript[editingIndex].word = editingText;
    setTranscript(updatedTranscript);
    setEditingIndex(null);
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
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
          <span key={index} className="inline-block text-sm font-medium">
            {editingIndex === index ? (
              <input
                ref={inputRef}
                type="text"
                value={editingText}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="border border-blue-500 focus:outline-none"
              />
            ) : (
              <span
                onClick={() => handleWordClick(index)}
                className={`cursor-pointer rounded-lg px-0.5 py-0.5 transition-all ${
                  currentWordIndex === index
                    ? "border border-yellow-500 bg-yellow-500"
                    : "border border-transparent"
                }`}
              >
                {wordObj.word}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TranscriptEditor;
