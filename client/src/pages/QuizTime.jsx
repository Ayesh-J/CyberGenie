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
  const [answers, setAnswers] = useState([]);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/quiz/quizzes/${moduleId}`);
        const formatted = [...new Map(
          res.data.quiz.questions.map(q => [q.id, {
            question_text: q.question_text,
            options: q.options.map(o => o.option_text),
            correct_option_index: q.options.findIndex(o => o.is_correct === 1),
          }])
        ).values()];
        setQuestions(formatted);
      } catch {
        setError("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuestions();
  }, [moduleId]);

  // Timer countdown
  useEffect(() => {
    if (loading || error || questions.length === 0 || selectedOption === null) return;

    const timer = setTimeout(() => {
      if (timeLeft === 1) {
        handleNext();
      } else {
        setTimeLeft(t => t - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selectedOption]);

  // Sync selected option when switching questions
  useEffect(() => {
    setSelectedOption(answers[currentQuestion] ?? null);
    setTimeLeft(60); // reset timer on question change
  }, [currentQuestion]);

  const question = questions[currentQuestion];

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;

    const newAnswers = [...answers];

    // Count score only if this question hasn't already been answered
    if (newAnswers[currentQuestion] === undefined && index === question.correct_option_index) {
      setScore(prev => prev + 1);
    }

    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
    setSelectedOption(index);
  };

  const handleNext = () => {
    const isLast = currentQuestion === questions.length - 1;

    if (isLast) {
      onQuizSubmit(score);
    } else {
      setCurrentQuestion(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(i => i - 1);
    }
  };

  // Render states
  if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (questions.length === 0) return <p className="text-center text-gray-600">No questions available.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 mt-10 relative pt-16">
        {/* Score + Timer */}
        <div className="absolute top-4 right-4 flex gap-4 items-center text-sm text-gray-500">
          <span className="bg-gray-100 rounded-full px-3 py-1 font-semibold">
            Score: {score}/{questions.length}
          </span>
          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-semibold">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-lg md:text-xl font-semibold mb-6 text-gray-800">
          {currentQuestion + 1}. {question.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, index) => {
            let statusClass = "bg-gray-50 hover:bg-blue-100 text-gray-700 border-gray-200";

            if (selectedOption !== null) {
              if (index === question.correct_option_index) {
                statusClass = "bg-green-100 text-green-800 border-green-300";
              } else if (index === selectedOption) {
                statusClass = "bg-red-100 text-red-800 border-red-300";
              } else {
                statusClass = "bg-gray-100 text-gray-600 border-gray-300";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
                className={`w-full text-left px-5 py-3 rounded-xl shadow border transition font-medium ${statusClass}`}
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
