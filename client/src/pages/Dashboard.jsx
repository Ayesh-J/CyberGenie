import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Award, Lightbulb, AlertTriangle, User } from 'lucide-react';
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

        const progressRes = await api.get('/dashboard/progress');
        const { total, completed } = progressRes.data;
        const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
        setProgress(progressPercent);

        const quizRes = await api.get('/dashboard/quizzes');
        setQuizzes(quizRes.data.quizzesAnswered);

        const badgeRes = await api.get('/dashboard/badges');
        setBadges(badgeRes.data.badgesEarned);

        const tipRes = await api.get('/dashboard/random');
        const tipList = tipRes.data;
        const randomTip = tipList.length > 0 ? tipList[Math.floor(Math.random() * tipList.length)].fact : '';
        setTip(randomTip);

        const alertRes = await api.get('/dashboard/alerts');
        const alertList = alertRes.data;
        const randomAlert = alertList.length > 0 ? alertList[Math.floor(Math.random() * alertList.length)].title : '';
        setAlert(randomAlert);

      } catch (err) {
        console.error('Dashboard Load Failed:', err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="px-8 py-10 max-w-[1400px] mx-auto w-full space-y-10">
      <motion.h1
        className="text-4xl font-bold text-gray-800 flex gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
       <User size={40}/> Welcome, {email}
      </motion.h1>

      {/* Stats Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        <StatCard label="LearnZone Progress" value={`${progress}%`} Icon={BookOpen} delay={0.1} />
        <StatCard label="Quizzes Answered" value={quizzes} Icon={Brain} delay={0.2} />
        <StatCard label="Badges Earned" value={badges} Icon={Award} delay={0.3} />
      </div>

      {/* Tip & Alert */}
      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div
          className="bg-blue-100 p-8 rounded-2xl shadow-lg flex-1 min-h-[140px]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 text-blue-800 text-xl font-semibold mb-4">
            <Lightbulb size={22} /> <span>Tip</span>
          </div>
          <p className="text-gray-800 text-base leading-relaxed">{tip}</p>
        </motion.div>

        <motion.div
          className="bg-red-100 p-8 rounded-2xl shadow-lg flex-1 min-h-[140px]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 text-red-800 text-xl font-semibold mb-4">
            <AlertTriangle size={22} /> <span>Alert</span>
          </div>
          <p className="text-gray-800 text-base leading-relaxed">{alert}</p>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, Icon, delay }) => (
  <motion.div
    className="bg-white p-8 rounded-2xl shadow-md flex items-center space-x-6 flex-1 border border-gray-200 min-h-[120px]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Icon className="text-indigo-600" size={36} />
    <div>
      <div className="text-lg text-gray-600">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  </motion.div>
);

export default Dashboard;
