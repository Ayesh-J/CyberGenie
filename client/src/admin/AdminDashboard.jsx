import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Book,
  FileText,
  LayoutDashboard,
  FolderKanban,
  BookOpenText,
  BookUser
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
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
      icon: <User className="w-6 h-6" />
    },
    {
      title: "Modules Uploaded",
      key: "total_modules",
      color: "from-teal-500 to-teal-700",
      icon: <Book className="w-6 h-6" />
    },
    {
      title: "Quizzes Added",
      key: "total_quizzes",
      color: "from-amber-500 to-amber-700",
      icon: <FileText className="w-6 h-6" />
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 backdrop-blur-xl shadow-2xl p-6 space-y-8 border-r border-white/10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-[#14142b]-400 tracking-wide"
        >
          CyberGenie
        </motion.h1>
        <nav className="space-y-4 text-base font-medium">
          <a href="/admin" className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="/admincontent" className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition">
            <FolderKanban className="w-5 h-5" /> Manage Content
          </a>
          <a href="/adminquiz" className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition">
            <BookOpenText className="w-5 h-5" /> Quiz Editor
          </a>
          <a href="/adminusers" className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition">
            <BookUser className="w-5 h-5" /> Users
          </a>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 px-10 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-semibold text-[#14142b]-400 tracking-tight mb-10"
        >
          Admin Dashboard
        </motion.h2>

        {loading ? (
          <p className="text-gray-400">Loading statistics...</p>
        ) : stats?.error ? (
          <p className="text-red-500">{stats.error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-3xl bg-gradient-to-br ${card.color} p-6 shadow-2xl border border-white/10 backdrop-blur-lg`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium tracking-wide">{card.title}</h3>
                  <div className="bg-white/10 p-2 rounded-full border border-white/20 shadow-inner">
                    {card.icon}
                  </div>
                </div>
                <p className="text-5xl font-extrabold mt-6 tracking-tight drop-shadow-md">
                  {stats[card.key] ?? "0"}
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
