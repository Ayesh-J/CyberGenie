import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, ShieldCheck, UserCircle } from "lucide-react";

const UserDashboard = () => {
  const [username, setUsername] = useState("User");
  const [tips, setTips] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    // Fetch user profile
    axios.get("/api/user/profile")
      .then(res => setUsername(res.data.username))
      .catch(() => setUsername("User"));

    // Fetch tips with safety check
    axios.get("/api/dashboard/tips")
      .then(res => {
        console.log("Tips data:", res.data);
        setTips(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTips([]));

    // Fetch alerts with safety check
    axios.get("/api/dashboard/alerts")
      .then(res => {
        console.log("Alerts data:", res.data);
        setAlerts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setAlerts([]));

    // Fetch progress data
    axios.get("/api/dashboard/progress")
      .then(res => setProgress(res.data))
      .catch(() => setProgress({ completed: 0, total: 0 }));
  }, []);

  const percentage = progress.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  // SVG Circle progress parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-50 to-white p-10 font-sans">
      {/* Header */}
      <header className="mb-10 flex items-center space-x-4">
        <UserCircle className="w-14 h-14 text-blue-600" />
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome back, <span className="text-blue-600">{username}</span>
        </h1>
      </header>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Progress Card */}
        <article className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-6 text-blue-700">Your Progress</h2>
          <svg
            className="mb-6"
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth="12"
              r={radius}
              cx="60"
              cy="60"
            />
            <circle
              stroke="#3b82f6"
              fill="transparent"
              strokeWidth="12"
              strokeLinecap="round"
              r={radius}
              cx="60"
              cy="60"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="28"
              fill="#2563eb"
              fontWeight="700"
            >
              {percentage}%
            </text>
          </svg>
          <p className="text-gray-700 text-center">
            Completed {progress.completed} of {progress.total} lessons
          </p>
        </article>

        {/* Tips Card */}
        <article className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" /> Cyber Safety Tips
          </h2>
          <ul className="list-disc list-inside space-y-2 max-h-72 overflow-y-auto text-gray-700 text-sm">
            {Array.isArray(tips) && tips.length ? (
              tips.map((tip, i) => <li key={i}>{tip.text}</li>)
            ) : (
              <li>No tips available</li>
            )}
          </ul>
        </article>

        {/* Alerts Card */}
        <article className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" /> Security Alerts
          </h2>
          <ul className="space-y-3 max-h-72 overflow-y-auto text-red-700 text-sm">
            {Array.isArray(alerts) && alerts.length ? (
              alerts.map((alert, i) => (
                <li key={i} className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {alert.title}
                </li>
              ))
            ) : (
              <li>No alerts</li>
            )}
          </ul>
        </article>
      </section>
    </main>
  );
};

export default UserDashboard;
