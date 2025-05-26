import { useState } from 'react'
import { Route, Routes   } from 'react-router-dom'

//pages
import Home from './pages/Home'
import LearnZone from './pages/LearnZone'
import QuizTime from './pages/QuizTime'
import ChatBot from './pages/ChatBot'
import Dashboard from './pages/Dashboard'

//components
import Navbar from './components/Navbar'
import GenieChat from './components/GenieChat'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Footer from './components/Footer'


function App() {
   

  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<LearnZone />} />
          <Route path="/quiz" element={<QuizTime />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
<Footer />
        <GenieChat />
      </div>
  )
}

export default App
