import { useState } from 'react'
import { Route, Routes   } from 'react-router-dom'

//pages
import Home from './pages/Home'
import LearnZone from './pages/LearnZone'
import QuizTime from './pages/QuizTime'
import Dashboard from './pages/Dashboard'

//components
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Footer from './components/Footer'
import Resources from './components/Resources'
import QuizPage from './components/QuizPage'


function App() {
   

  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<LearnZone />} />
          <Route path="/quiz" element={<QuizTime />}/>
          <Route path="/learnzone/modules/:moduleId/resources" element={<Resources />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/learnzone/modules/:moduleId/quiz" element={<QuizPage />} />
 
          
        </Routes>
<Footer />
        <Chatbot />
      </div>
  )
}

export default App;
