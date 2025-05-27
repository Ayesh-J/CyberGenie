// Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, House, GraduationCap, BookOpenCheck, ChartArea  } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-br from-blue-500 to-purple-700 shadow-md px-2 py-2 flex justify-between items-center hover:shadow-lg">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-2">
        <img
          src="./images/Cybergenie_logo.png"
          alt="CyberGenie Logo"
          className="h-15 w-15   object-contain"
         />
        {/* <span className="text-4xl font-bold text-white">CyberGenie</span> */}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        <Link to="/" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"> <House />Home</Link>
        <Link to="/learn" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"> <GraduationCap />LearnZone</Link>
        <Link to="/quiz" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><BookOpenCheck/>QuizTime</Link>
        <Link to="/dashboard" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><ChartArea/>Dashboard</Link>
      </div>

      {/* Hamburger Button (mobile only) */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md md:hidden flex flex-col space-y-2 px-6 py-4 z-50">
          <Link to="/" className="text-gray-800 hover:text-blue-600 flex items-center gap-4" onClick={() => setMenuOpen(false)}><House/>Home</Link>
          <Link to="/learn" className="text-gray-800 hover:text-blue-600 flex items-center gap-4" onClick={() => setMenuOpen(false)}><GraduationCap/>Learn Zone</Link>
          <Link to="/quiz" className="text-gray-800 hover:text-blue-600 flex items-center gap-4" onClick={() => setMenuOpen(false)}><BookOpenCheck/>Quiz Time</Link>
          <Link to="/dashboard" className="text-gray-800 hover:text-blue-600 flex items-center gap-4" onClick={() => setMenuOpen(false)}><ChartArea/>Dashboard</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
