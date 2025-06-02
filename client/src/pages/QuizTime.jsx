import React, { useState, useEffect } from "react";
import api from "../utilities/api";

const QuizTime = ({ moduleId, onQuizSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!moduleId) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching quiz for module:', moduleId);
        console.log('URL:', `/quiz/quizzes/${moduleId}`);
        const res = await api.get(`/quiz/quizzes/${moduleId}`);

        const formatted = res.data.quiz.questions.map(q => {
          const optionsArray = q.options.map(o => o.option_text);
          const correctIndex = q.options.findIndex(o => o.is_correct === 1);
          return {
            question_text: q.question_text,
            options: optionsArray,
            correct_option_index: correctIndex
          };
        });

        setQuestions(formatted);
      } catch (err) {
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [moduleId]);

  useEffect(() => {
    if (loading || error) return;
    if (timeLeft === 0) {
      handleNext();
    } else {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, loading, error]);

  if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (questions.length === 0) return <p className="text-center text-gray-600">No quiz questions available for this module.</p>;

  const question = questions[currentQuestion];

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    if (index === question.correct_option_index) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTimeLeft(60);

    if (currentQuestion + 1 === questions.length) {
      if (onQuizSubmit) onQuizSubmit(score);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setTimeLeft(60);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 mt-10 relative">
        <div className="absolute top-4 right-4 flex gap-4 items-center text-sm text-gray-500">
          <span className="bg-gray-100 rounded-full px-3 py-1 font-semibold">
            Score: {score}/{questions.length}
          </span>
          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>

        <h2 className="text-lg md:text-xl font-semibold mb-6 text-gray-800">
          {currentQuestion + 1}. {question.question_text}
        </h2>

        <div className="space-y-3">
          {question.options.map((opt, index) => {
            let baseClass = "w-full text-left px-5 py-3 rounded-xl shadow border transition font-medium";
            let statusClass = "";

            if (selectedOption !== null) {
              if (index === question.correct_option_index) {
                statusClass = "bg-green-100 text-green-800 border-green-300";
              } else if (index === selectedOption) {
                statusClass = "bg-red-100 text-red-800 border-red-300";
              } else {
                statusClass = "bg-gray-100 text-gray-600 border-gray-300";
              }
            } else {
              statusClass = "bg-gray-50 hover:bg-blue-100 text-gray-700 border-gray-200";
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

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            disabled={selectedOption === null}
          >
            {currentQuestion + 1 === questions.length ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTime;
