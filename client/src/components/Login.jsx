import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../authContext"; // Adjust path as needed

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // get setUser to update context on login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with credentials (cookies)
      const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
        withCredentials: true,
      });

      // ✅ store userId in localStorage
      localStorage.setItem("userId", res.data.user.id);

      // ✅ update context
      setUser(res.data.user);


      // Redirect to homepage (or dashboard)
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="absolute top-3 left-3 w-full h-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl opacity-60 z-0"></div>
        <div className="relative z-10 w-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl flex flex-col items-center justify-center px-6 py-8 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Log in</h2>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold py-2 rounded-md shadow-lg hover:opacity-90 transition"
            >
              Log in
            </button>
          </form>
          <p className="text-white text-sm mt-4">Don’t have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
