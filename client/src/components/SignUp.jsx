import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../authContext";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser: login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Sign up
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
      
      // Step 2: Auto login
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      const { user, token } = res.data;
      login(user, token);

      // Step 3: Store ID and token
      if (user?.id) {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("token", token);
        console.log("Signed up & Logged in User ID:", user.id);
      }

      // Step 4: Navigate
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <motion.div
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Shadow Layer */}
        <div className="absolute top-3 left-3 w-full h-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl opacity-60 z-0"></div>

        {/* Main Card */}
        <div className="relative z-10 w-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl flex flex-col items-center justify-center px-6 py-8 shadow-2xl">
          <motion.h2
            className="text-white text-2xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Sign up
          </motion.h2>

          <motion.form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {["email", "password"].map((field) => (
              <motion.input
                key={field}
                type={field === "password" ? "password" : "email"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              />
            ))}

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold py-2 rounded-md shadow-lg hover:opacity-90 transition"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Sign up
            </motion.button>
          </motion.form>

          <motion.p
            className="text-white text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Already a user?
          </motion.p>

          <motion.button
            onClick={() => navigate("/login")}
            className="mt-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Log in
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
