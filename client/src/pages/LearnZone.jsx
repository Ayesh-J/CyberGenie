import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utilities/api";
import { useAuth } from "../authContext";
import { motion } from "framer-motion";

const LearnZone = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [modules, setModules] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [didYouKnow, setDidYouKnow] = useState("");
  const [factLoading, setFactLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchModulesAndProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const modulesRes = await api.get("/learnzone/modules");
        const progressRes = await api.get(`/progress/${userId}`);

        const progressMap = {};
        progressRes.data.forEach(({ module_id, progress_percent }) => {
          progressMap[module_id] = progress_percent;
        });

        setModules(modulesRes.data);
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

  useEffect(() => {
    const getRandomFact = async () => {
      try {
        const res = await api.get("/facts/random");
        setDidYouKnow(res.data.fact);
      } catch (err) {
        setDidYouKnow("Stay Safe Online. Avoid suspicious links.");
      } finally {
        setFactLoading(false);
      }
    };

    getRandomFact();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="px-6 py-10 bg-gray-50 min-h-screen" aria-label="LearnZone main content">
      
      {/* Hero Banner */}
      <motion.section
        className="bg-gradient-to-br from-blue-500 to-purple-700 text-white p-8 rounded-2xl mb-10"
        aria-label="Welcome Banner"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Welcome to Learn Zone!</h1>
        <p className="text-lg opacity-90">
          Ready to become a cyber-smart citizen? Start your journey with our quick lessons below.
        </p>
      </motion.section>

      {/* Did You Know Section */}
      <motion.section
        className="bg-yellow-100 p-4 rounded-xl shadow mb-8"
        aria-label="Did you know section"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">🔐 Did You Know?</h2>
        <p className="text-gray-800">{factLoading ? "Loading a fun fact..." : didYouKnow}</p>
      </motion.section>

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-600" role="status">Loading modules and progress...</p>}
      {error && <p className="text-center text-red-500" role="alert">{error}</p>}

      {/* Module Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Learning Modules">
        {!loading &&
          !error &&
          modules.map((mod, idx) => {
            const progress = progressMap[mod.id] || 0;

            return (
              <motion.article
                key={mod.id || idx}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transform transition-transform duration-300 hover:scale-[1.03] p-5 flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-400"
                tabIndex="0"
                role="button"
                aria-label={`${mod.title} module card`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const route = progress === 100 ? "quiz" : "resources";
                    navigate(`/learnzone/modules/${mod.id}/${route}`);
                  }
                }}
              >
                {idx === 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full mb-2 animate-pulse" aria-hidden="true">
                    🔥 Recommended
                  </span>
                )}
                <img
                  src={mod.image_url || "./images/default.jpg"}
                  alt={mod.title || "Module preview"}
                  className="w-full h-40 object-cover rounded-xl mb-4 transition-transform duration-500 group-hover:scale-110"
                />
                <h3 className="text-xl font-semibold text-blue-600 mb-1">{mod.title}</h3>
                <div className="flex gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{mod.level}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{mod.duration}</span>
                </div>
                <p className="text-gray-600 mb-3 text-sm">{mod.description}</p>
                <div className="relative h-3 bg-gray-200 rounded-full w-full overflow-hidden mb-3" aria-label={`Progress: ${progress}%`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <span className="absolute inset-0 text-[10px] text-white font-bold text-center leading-[0.75rem]">
                    {progress}%
                  </span>
                </div>
                <button
                  onClick={() => {
                    const route = progress === 100 ? "quiz" : "resources";
                    navigate(`/learnzone/modules/${mod.id}/${route}`);
                  }}
                  className="flex items-center text-sm font-medium text-blue-500 hover:underline mt-auto"
                  aria-label={progress === 100 ? `Take quiz for ${mod.title}` : `Start learning ${mod.title}`}
                >
                  {progress === 100 ? "Take Quiz" : "Start Learning"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </motion.article>
            );
          })}
      </section>
    </main>
  );
};

export default LearnZone;
