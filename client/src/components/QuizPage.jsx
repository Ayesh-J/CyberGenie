import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utilities/api";
import QuizTime from "../pages/QuizTime";

const QuizPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [newBadges, setNewBadges] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQuizMeta = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/quiz/quizzes/${moduleId}`);
        if (res.data && res.data.quiz && res.data.quiz.total_questions) {
          setTotalQuestions(res.data.quiz.total_questions);
        }
      } catch (err) {
        setError("Failed to load quiz metadata.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizMeta();
  }, [moduleId]);

  const handleQuizSubmit = async (score) => {
    try {
      const userId = localStorage.getItem("userId");
      const moduleIdFromParams = moduleId;
      console.log("Submitting quiz score:", { userId, moduleId: moduleIdFromParams, score });

      const res = await api.post("/quiz/submit", {
        userId,
        moduleId: moduleIdFromParams,
        score,
      });

      if (res.data.badgeAwarded && res.data.badgeAwarded.length > 0) {
        setNewBadges(res.data.badgeAwarded);
        setShowModal(true);
      }

      setFinalScore(score);
      setQuizFinished(true);
    } catch (err) {
      console.error("Failed to submit quiz score", err);
      setError("Failed to submit quiz results. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg my-18">
      {!quizFinished ? (
        <QuizTime moduleId={moduleId} onQuizSubmit={handleQuizSubmit} />
      ) : (
        <div className="text-center mt-12">
          <h2 className="text-4xl font-extrabold mb-6 text-indigo-600">Quiz Completed!</h2>
          <p className="text-xl text-gray-800 mb-8">
            You scored <span className="font-semibold">{finalScore}</span> out of{" "}
            <span className="font-semibold">{totalQuestions}</span>
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate("/learn")}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md shadow-md hover:bg-gray-400 transition"
            >
              Back to LearnZone
            </button>
          </div>
        </div>
      )}

      {/* Badge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center relative">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🏅 New Badge Unlocked!</h2>
            {newBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center mb-2">
                <img
                  src={`/badges/${badge.replace(/\s+/g, '_')}.png`}
                  alt={badge}
                  className="w-10 h-10"
                />
                <span className="text-lg font-semibold">{badge}</span>
              </div>
            ))}
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
