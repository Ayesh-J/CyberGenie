import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../utilities/api';
import { CircleCheckBig } from 'lucide-react';
import { useAuth } from "../authContext";

const Resources = () => {
  const { moduleId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [resources, setResources] = useState([]);
  const [viewedResources, setViewedResources] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchResourcesAndProgress = async () => {
      try {
        setLoading(true);

        // Fetch resources
        const res = await api.get(`/resources?module_id=${moduleId}`);
        setResources(res.data);

        // Fetch viewed resource IDs
        const viewedRes = await api.get(`/resource-progress/${user.id}/module/${moduleId}`);
        const viewedIds = viewedRes.data.map(item => item.resource_id || item.id);
        setViewedResources(new Set(viewedIds));

      } catch (err) {
        setError("Failed to load resources or progress.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResourcesAndProgress();
  }, [moduleId, user, authLoading]);

  const markResourceViewed = async (resourceId) => {
    if (viewedResources.has(resourceId)) return;

    try {
      await api.post('/resource-progress/view', {
        user_id: user.id,
        resource_id: resourceId,
      });
      setViewedResources(prev => new Set(prev).add(resourceId));
    } catch (err) {
      console.error('Failed to mark resource as viewed', err);
    }
  };

  if (authLoading || !user) return <p>Loading session...</p>;
  if (loading) return <p>Loading resources...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-700 text-white p-8 rounded-2xl mb-10">
        <h1 className="text-4xl font-bold mb-2">Learning Resources</h1>
        <p className="text-lg opacity-90">Let's dive right into the world of knowledge</p>
      </div>

      {resources.length === 0 ? (
        <p>No resources found for this module.</p>
      ) : (
        <ul className="space-y-4">
          {resources.map(resource => {
            const isViewed = viewedResources.has(resource.id);
            return (
              <li
                key={resource.id}
                className={`border-none rounded p-4 shadow-sm transition-transform duration-300 hover:scale-102 flex justify-between items-center ${
                  isViewed ? "opacity-60" : ""
                }`}
              >
                <div>
                  <h2 className="text-xl font-semibold">{resource.title}</h2>
                  <p className="text-gray-700 mb-2">{resource.description}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Type: {resource.resource_type} | Duration: {resource.duration}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mb-2"
                    onClick={() => markResourceViewed(resource.id)}
                  >
                    View Resource
                  </a>
                  {isViewed && (
                    <span className="text-green-600 font-bold flex gap-2">
                      <CircleCheckBig /> Viewed
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Resources;
