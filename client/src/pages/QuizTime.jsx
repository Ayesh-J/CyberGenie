import React, { useState } from "react";

const QuizTime = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const question = {
    text: "Which of the passwords is Strongest?",
    options: ["12345678", "P@ssw0rd!", "qwerty", "iloveyou"],
    correctIndex: 1,
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    // Replace with next question logic
    setSelectedOption(null);
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      
       

      {/* Quiz Card */}
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 mt-10 relative">
        {/* Score and Timer */}
        <div className="absolute top-4 right-4 flex gap-4 items-center text-sm text-gray-500">
          <span className="bg-gray-100 rounded-full px-3 py-1 font-semibold">
            Score: {score}/10
          </span>
          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-lg md:text-xl font-semibold mb-6 text-gray-800">
          {currentQuestion + 1}. {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, index) => {
            let baseClass =
              "w-full text-left px-5 py-3 rounded-xl shadow border transition font-medium";
            let statusClass = "";

            if (selectedOption !== null) {
              if (index === question.correctIndex) {
                statusClass = "bg-green-100 text-green-800 border-green-300";
              } else if (index === selectedOption) {
                statusClass = "bg-red-100 text-red-800 border-red-300";
              } else {
                statusClass = "bg-gray-100 text-gray-600 border-gray-300";
              }
            } else {
              statusClass =
                "bg-gray-50 hover:bg-blue-100 text-gray-700 border-gray-200";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
                className={`${baseClass} ${statusClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default QuizTime;
