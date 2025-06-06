import React, { useEffect, useState } from 'react';
import api from '../utilities/api';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [badges, setBadges] = useState(0);
  const [tip, setTip] = useState('');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userRes = await api.get('/user/profile');
        setEmail(userRes.data.email);

        const progressRes = await api.get('/dashboard/learnzone-progress');
        setProgress(progressRes.data.progress);

        const quizRes = await api.get('/dashboard/quiz-count');
        setQuizzes(quizRes.data.quizCount);

        const badgeRes = await api.get('/dashboard/badge-count');
        setBadges(badgeRes.data.badgeCount);

        const tipRes = await api.get('/dashboard/tip');
        setTip(tipRes.data.tip);

        const alertRes = await api.get('/dashboard/alert');
        setAlert(alertRes.data.alert);

      } catch (err) {
        console.error('Dashboard Load Failed:', err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {email}</h1>
      <p>📘 LearnZone Progress: {progress}%</p>
      <p>🧠 Quizzes Answered: {quizzes}</p>
      <p>🏅 Badges Earned: {badges}</p>
      <div className="bg-blue-100 p-4 rounded shadow">
        <strong>💡 Tip:</strong> {tip}
      </div>
      <div className="bg-red-100 p-4 rounded shadow">
        <strong>🚨 Alert:</strong> {alert}
      </div>
    </div>
  );
};

export default Dashboard;
