/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

const TranscriptWord = (props) => {
  const { currentWordIndex, transcript, setTranscript, wordObj, index } = props;

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const handleInputSubmit = () => {
    const updatedTranscript = [...transcript];
    updatedTranscript[editingIndex].word = editingText;
    setTranscript(updatedTranscript);
    setEditingIndex(null);
  };

  const handleWordClick = (index) => {
    setEditingIndex(index);
    setEditingText(transcript[index].word);
  };

  const handleInputChange = (e) => {
    setEditingText(e.target.value);
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  return (
    <>
      <span key={index} className="inline-block text-sm font-medium">
        {editingIndex === index ? (
          <input
            ref={inputRef}
            type="text"
            value={editingText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
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
            {wordObj?.word}
          </span>
        )}
      </span>
    </>
  );
};

export default TranscriptWord;
