import { useState, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContext } from './authContext';

// pages
import Home from './pages/Home';
import LearnZone from './pages/LearnZone';
import QuizTime from './pages/QuizTime';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import Terms from './pages/Terms';

// components
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Resources from './components/Resources';
import QuizPage from './components/QuizPage';
import AdminRoute from './admin/AdminRoutes';
import AdminContent from './admin/AdminContent';
import AdminQuiz from './admin/AdminQuiz';
import AdminUsers from './admin/AdminUsers';

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  console.log("API Base URL:", import.meta.env.VITE_API_URL);


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<LearnZone />} />
        <Route path="/quiz" element={<QuizTime />} />
        <Route path="/learnzone/modules/:moduleId/resources" element={<Resources />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/learnzone/modules/:moduleId/quiz" element={<QuizPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/admindashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/admincontent" element={<AdminContent />} />
        <Route path="/adminquiz" element={<AdminQuiz />} />
        <Route path="/adminusers" element={<AdminUsers />} />
      </Routes>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
