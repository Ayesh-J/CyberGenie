import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Book, FileText, LayoutDashboard, FolderKanban,  BookOpenText, BookUser } from "lucide-react";

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
      color: "from-indigo-500 to-indigo-700", 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      title: "Modules Uploaded", 
      key: "total_modules", 
      color: "from-teal-500 to-teal-700", 
      icon: <Book className="w-5 h-5" /> 
    },
    { 
      title: "Quizzes Added", 
      key: "total_quizzes", 
      color: "from-amber-500 to-amber-700", 
      icon: <FileText className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950/80 backdrop-blur-lg shadow-xl p-6 space-y-8 border-r border-gray-800">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">CyberGenie</h1>
        <nav className="space-y-3 font-medium">
          <a href="/admin" className="block hover:text-cyan-300 transition flex gap-4 mb-8"> <LayoutDashboard/> Dashboard</a>
          <a href="/admincontent" className="block hover:text-cyan-300 transition flex gap-4 mb-8"> <FolderKanban/> Manage Content</a>
          <a href="/adminquiz" className="block hover:text-cyan-300 transition flex gap-4 mb-8"> <BookOpenText/> Quiz Editor</a>
          <a href="/adminusers" className="block hover:text-cyan-300 transition flex gap-4 mb-8"> <BookUser/> Users</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-4xl font-semibold mb-8 text-white tracking-tight">
          Admin Dashboard
        </h2>

        {loading ? (
          <p className="text-gray-300">Loading statistics...</p>
        ) : stats?.error ? (
          <p className="text-red-500">{stats.error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.04 }}
                className={`rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-xl border border-white/10 backdrop-blur-sm`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">{card.title}</h3>
                  <div className="text-white opacity-80">{card.icon}</div>
                </div>
                <p className="text-4xl font-extrabold mt-4 text-white drop-shadow">
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
