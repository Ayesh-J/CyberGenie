import React, { useEffect, useState } from 'react';
import { BadgeCheck, BookOpen, ClipboardCheck, X, User, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utilities/api';

const modalBackdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const modalContent = {
  hidden: { y: '-100vh', opacity: 0 },
  visible: { y: '0', opacity: 1, transition: { delay: 0.1 } },
  exit: { y: '100vh', opacity: 0 }
};

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState({ total: 0, completed: 0 });
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [badgesCount, setBadgesCount] = useState(0);
  const [tip, setTip] = useState('');
  const [alert, setAlert] = useState('');
  const [eligible, setEligible] = useState(false); //  certificate logic

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showQuizzesModal, setShowQuizzesModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const [progressDetails, setProgressDetails] = useState([]);
  const [quizDetails, setQuizDetails] = useState([]);
  const [badgeDetails, setBadgeDetails] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userRes = await api.get('/user/profile');
        setEmail(userRes.data.email);

        const progressRes = await api.get('/dashboard/progress');
        setProgress({
          total: progressRes.data.total || 0,
          completed: progressRes.data.completed || 0
        });

        const quizRes = await api.get('/dashboard/quizzes');
        setQuizzesCount(quizRes.data.quizzesAnswered || 0);

        const badgeRes = await api.get('/dashboard/badges');
        setBadgesCount(badgeRes.data.badgesEarned || 0);

        const tipRes = await api.get('/dashboard/random');
        setTip(tipRes.data[0]?.fact || 'No tips available');

        const alertRes = await api.get('/dashboard/alerts');
        setAlert(alertRes.data[0]?.title || 'No alerts available');

        const certRes = await api.get('/user/certificates/status');
        setEligible(certRes.data.eligible || false); //  set eligibility
      } catch (err) {
        console.error('Dashboard Load Failed:', err);
      }
    };

    fetchDashboard();
  }, []);

  const openProgressModal = async () => {
    try {
      const res = await api.get('/dashboard/progress-details');
      setProgressDetails(res.data);
      setShowProgressModal(true);
    } catch (err) {
      console.error('Failed to load progress details:', err);
    }
  };

  const openQuizzesModal = async () => {
    try {
      const res = await api.get('/dashboard/quiz-details');
      setQuizDetails(res.data);
      setShowQuizzesModal(true);
    } catch (err) {
      console.error('Failed to load quiz details:', err);
    }
  };

  const openBadgesModal = async () => {
    try {
      const res = await api.get('/dashboard/badge-details');
      setBadgeDetails(res.data);
      setShowBadgesModal(true);
    } catch (err) {
      console.error('Failed to load badge details:', err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-4 bg-gradient-to-br from-blue-500 to-purple-700 text-white p-8 rounded-2xl mb-10">
        <User size={40} /> Welcome, {email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div onClick={openProgressModal} className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition">
          <BookOpen size={48} className="text-blue-600" />
          <h2 className="text-xl font-semibold">LearnZone Progress</h2>
          <p className="text-2xl font-bold">{progress.completed} / {progress.total}</p>
          <p className="text-gray-600">Modules completed</p>
        </div>

        <div onClick={openQuizzesModal} className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition">
          <ClipboardCheck size={48} className="text-green-600" />
          <h2 className="text-xl font-semibold">Quizzes Answered</h2>
          <p className="text-2xl font-bold">{quizzesCount}</p>
        </div>

        <div onClick={openBadgesModal} className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-lg transition">
          <BadgeCheck size={48} className="text-yellow-600" />
          <h2 className="text-xl font-semibold">Badges Earned</h2>
          <p className="text-2xl font-bold">{badgesCount}</p>
        </div>
      </div>

      {/*  Certificate Download Button */}
      {eligible && (
        <div className="text-center mt-10">
          <a
            href="/api/user/certificates/download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all"
          >
            <Download size={20} /> Download Your Certificate
          </a>
        </div>
      )}

      {/* Tips and Alerts */}
      <div className="mt-10 space-y-4">
        <div className="bg-blue-100 p-6 rounded shadow">
          <strong className="text-blue-700">Tip:</strong> {tip}
        </div>
        <div className="bg-red-100 p-6 rounded shadow">
          <strong className="text-red-700">Alert:</strong> {alert}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showProgressModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowProgressModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-auto relative"
              variants={modalContent}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowProgressModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Modules Learned</h2>
              {progressDetails.length === 0 ? (
                <p>No modules completed yet.</p>
              ) : (
                <ul className="space-y-3">
                  {progressDetails.map(module => (
                    <li key={module.id} className="border-b pb-2">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-gray-700 text-sm">{module.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}

        {showQuizzesModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowQuizzesModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-auto relative"
              variants={modalContent}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQuizzesModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Quizzes Answered</h2>
              {quizDetails.length === 0 ? (
                <p>No quizzes answered yet.</p>
              ) : (
                <ul className="space-y-3">
                  {quizDetails.map(quiz => (
                    <li key={quiz.id} className="border-b pb-2">
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p>
                        Score: <strong>{quiz.score ?? 'N/A'}</strong>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Completed on: {new Date(quiz.completed_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}

        {showBadgesModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowBadgesModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-auto relative"
              variants={modalContent}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowBadgesModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Badges Earned</h2>
              {badgeDetails.length === 0 ? (
                <p>No badges earned yet.</p>
              ) : (
                <ul className="space-y-3">
                  {badgeDetails.map(badge => (
                    <li key={badge.id} className="border-b pb-2">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-gray-700 text-sm">{badge.description}</p>
                      <p className="text-gray-500 text-xs">
                        Awarded on: {new Date(badge.awarded_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
