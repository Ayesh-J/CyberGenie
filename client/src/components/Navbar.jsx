import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu, X, House, UserRoundPlus, LogIn,
  ChartArea, GraduationCap, BookOpenCheck, LogOut
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../authContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-br from-blue-500 to-purple-700 shadow-md px-2 py-2 flex justify-between items-center hover:shadow-lg">
      <div className="flex items-center space-x-2">
        <img src="./images/Cybergenie_logo.png" alt="CyberGenie Logo" className="h-15 w-15 object-contain" />
      </div>

      <div className="hidden md:flex space-x-6 items-center justify-center">
        <Link to="/" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><House /> Home</Link>
        <Link to="/learn" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><BookOpenCheck /> LearnZone</Link>
        <Link to="/dashboard" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><ChartArea /> Dashboard</Link>
      </div>

      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md md:hidden flex flex-col space-y-2 px-6 py-4 z-50">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 flex items-center gap-4"><House /> Home</Link>
          <Link to="/learn" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 flex items-center gap-4"><BookOpenCheck /> LearnZone</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 flex items-center gap-4"><ChartArea /> Dashboard</Link>

          {!user ? (
            <>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 flex items-center gap-4"><UserRoundPlus /> Sign Up</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 flex items-center gap-4"><LogIn /> Login</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center gap-4">
              <LogOut /> Logout
            </button>
          )}
        </div>
      )}

      <div className="btn hidden md:flex items-center gap-2">
        {!user ? (
          <>
            <Link to="/signup" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><UserRoundPlus /> Sign Up</Link>
            <Link to="/login" className="text-white hover:text-blue-400 font-bold text-xl flex gap-1 items-center"><LogIn /> Login</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="text-white hover:text-red-300 font-bold text-xl flex gap-1 items-center">
            <LogOut /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
