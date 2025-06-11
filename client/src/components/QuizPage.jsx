import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utilities/api";
import QuizTime from "../pages/QuizTime";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";

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
        const res = await api.get(`/quiz/quizzes/${moduleId}`);
        if (res.data?.quiz?.total_questions) {
          setTotalQuestions(res.data.quiz.total_questions);
        }
      } catch {
        setError("Failed to load quiz metadata.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizMeta();
  }, [moduleId]);

  const handleQuizSubmit = async (score) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in. Please sign in again.");
      return;
    }

    try {
      const res = await api.post("/quiz/submit", {
        userId,
        moduleId,
        score,
      });

      if (res.data.badgeAwarded?.length > 0) {
        setNewBadges(res.data.badgeAwarded);
        setShowModal(true);
      }

      setFinalScore(score);
      setQuizFinished(true);
    } catch {
      setError("Failed to submit quiz results. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg my-18 relative">
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
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <Award className="w-6 h-6" />
                <h2 className="text-2xl font-bold">New Badge Unlocked!</h2>
              </div>

              {newBadges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center justify-center gap-2 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <img
                    src={`/badges/${badge.icon}`}
                    alt={badge.name}
                    className="w-12 h-12"
                    // onError={(e) => (e.target.src = "/fallback-badge.png")}
                  />
                  <span className="text-lg font-semibold text-gray-800">{badge.name}</span>
                </motion.div>
              ))}

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
