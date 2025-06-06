import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../authContext";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: false } // JWT doesn't need this
      );

      const { user, token } = res.data;
      setUser(user, token); // Pass both user and token to AuthContext
      navigate("/dashboard"); // or "/" if that's your default page
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || "Login failed");
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
        <div className="absolute top-3 left-3 w-full h-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl opacity-60 z-0"></div>
        <div className="relative z-10 w-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl flex flex-col items-center justify-center px-6 py-8 shadow-2xl">
          <motion.h2
            className="text-white text-2xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Log in
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
              Log in
            </motion.button>
          </motion.form>
          <motion.p
            className="text-white text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Don’t have an account?
          </motion.p>
          <motion.button
            onClick={() => navigate("/signup")}
            className="mt-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Sign up
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
