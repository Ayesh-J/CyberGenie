import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utilities/api";
import { useAuth } from "../authContext";

const LearnZone = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    console.log("User ID:", userId);
    if (!userId) return;

    const fetchModulesAndProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch modules
        const modulesRes = await api.get("/learnzone/modules");
        const modulesData = modulesRes.data;

        // Fetch user progress on modules
        const progressRes = await api.get(`/progress/${userId}`);
        const progressData = progressRes.data;

        // Map moduleId => progress_percent for quick lookup
        const progressMap = {};
        progressData.forEach(({ module_id, progress_percent }) => {
          progressMap[module_id] = progress_percent;
        });

        setModules(modulesData);
        setProgressMap(progressMap);
      } catch (err) {
        console.error(err);
        setError("Failed to load modules or progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndProgress();
  }, [userId]);

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-700 text-white p-8 rounded-2xl mb-10">
        <h1 className="text-4xl font-bold mb-2">Welcome to Learn Zone!</h1>
        <p className="text-lg opacity-90">
          Ready to become a cyber-smart citizen? Start your journey with our quick lessons below.
        </p>
      </div>

      {/* Loading & Error states */}
      {loading && <p className="text-center text-gray-600">Loading modules and progress...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && modules.map((mod, idx) => {
          const progress = progressMap[mod.id] || 0;

          return (
            <div
              key={mod.id || idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 p-5 flex flex-col"
            >
              {idx === 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full mb-2">
                  🔥 Recommended
                </span>
              )}
              <img
                src={mod.image_url || "./images/default.jpg"}
                alt={mod.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-blue-600 mb-1">{mod.title}</h2>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{mod.level}</span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{mod.duration}</span>
              </div>
              <p className="text-gray-600 mb-3 text-sm">{mod.description}</p>

              <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden mb-2">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mb-3">Progress: {progress}%</p>

              <button
                onClick={() => navigate(`/learnzone/modules/${mod.id}/resources`)}
                className="flex items-center text-sm font-medium text-blue-500 hover:underline"
              >
                Start Learning <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnZone;
