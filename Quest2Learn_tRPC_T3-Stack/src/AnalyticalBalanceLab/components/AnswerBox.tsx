import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";

const AnswerBox = (
  {
    question,
    correctAnswers = [], // Now an array of strings
    onCorrectAnswer,
    imageUrl, // Optional image URL prop
  }: {
    question: string;
    correctAnswers: string[]; // This is an array
    onCorrectAnswer: Function;
    imageUrl?: string; // This is optional
  },
  props: any
) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [isVisible, setIsVisible] = useState(true); // State for visibility
  const [shouldRender, setShouldRender] = useState(true); // State for actual rendering

  useEffect(() => {
    if (!isVisible) {
      // Wait for the fade-out transition before removing the component
      const timeoutId = setTimeout(() => setShouldRender(false), 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);

  const checkAnswer = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const isAnswerCorrect = correctAnswers.some(
      answer => normalizedUserAnswer === answer.toLowerCase()
    );

    if (isAnswerCorrect) {
      setAnswerFeedback("Correct!");
      onCorrectAnswer(); // Directly call onCorrectAnswer here

      // Start fade-out transition
      setIsVisible(false);
    } else {
      setAnswerFeedback("Incorrect, try again.");
    }
  };

  // Conditional rendering based on shouldRender
  if (!shouldRender) return null;

  return (
    <group>
      <Html
        occlude={100}
        zIndexRange={[10, 0]}
        center
        transform
        rotation-y={(3.14 / 180) * 90}
        {...props}
        style={{
          opacity: isVisible ? 1 : 0, // Control opacity
          transition: 'opacity 1.5s ease' // Smooth transition for opacity
        }}
      >
        <div className="flex justify-center items-center max-w-xs h-full">
          <div className="relative flex flex-col items-center p-5 bg-black bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg border border-white border-opacity-20 text-white user-select-none">
            <p className="mb-5 font-bold">{question}</p>

            {/* Render the image if imageUrl is provided */}
            {imageUrl && (
              <img src={imageUrl} alt="Answer Illustration" className="mb-5 max-w-xs" />
            )}

            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="p-2.5 mb-2.5 rounded border border-gray-300 w-full text-black"
            />
            <button
              onClick={checkAnswer}
              className="w-full py-2.5 px-5 border-none rounded bg-gradient-to-r from-cyan-400 to-blue-500 text-white cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              Check Answer
            </button>
            <div
              className={`mt-2.5 font-bold ${answerFeedback === "Correct!" ? "text-green-300" : "text-red-400"}`}
            >
              {answerFeedback}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default AnswerBox;
