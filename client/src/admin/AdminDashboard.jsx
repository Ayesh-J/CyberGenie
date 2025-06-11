import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Book, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({ error: "Unable to load stats" });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      title: "Total Users", 
      key: "total_users", 
      color: "bg-indigo-600", 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      title: "Modules Uploaded", 
      key: "total_modules", 
      color: "bg-teal-600", 
      icon: <Book className="w-5 h-5" /> 
    },
    { 
      title: "Quizzes Added", 
      key: "total_quizzes", 
      color: "bg-amber-600", 
      icon: <FileText className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - completely unchanged */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="space-y-2">
          <a href="/admin" className="block hover:text-blue-400">Dashboard</a>
          <a href="/admincontent" className="block hover:text-blue-400">Manage Content</a>
          <a href="#" className="block hover:text-blue-400">Quiz Editor</a>
          <a href="#" className="block hover:text-blue-400">Users</a>
        </nav>
      </aside>

      {/* Main Content - same dimensions, updated colors and animations */}
      <main className="flex-1 p-8 bg-gray-50">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : stats?.error ? (
          <p className="text-red-500">{stats.error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                className={`p-6 rounded-2xl shadow-md text-white ${card.color}`}
              >
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">{card.title}</h3>
                  {card.icon}
                </div>
                <p className="text-3xl font-bold mt-2">
                  {stats ? stats[card.key] ?? "0" : "N/A"}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;