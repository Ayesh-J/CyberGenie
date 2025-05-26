import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
      {/* Background Layer */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
        {/* Shadow background card */}
        <div className="absolute top-3 left-3 w-full h-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl opacity-60 z-0"></div>

        {/* Main Card */}
        <div className="relative z-10 w-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl flex flex-col items-center justify-center px-6 py-8 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-6">Sign up</h2>
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
              Sign up
            </button>
          </form>
          <p className="text-white text-sm mt-4">Already a user?</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
