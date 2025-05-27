import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../utilities/api';

const Resources = () => {
  const { moduleId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/resources?module_id=${moduleId}`);
        setResources(res.data);
      } catch (err) {
        setError("Failed to load resources.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [moduleId]);

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-700 text-white p-8 rounded-2xl mb-10">
        <h1 className="text-4xl font-bold mb-2">Learning Resources</h1>
        <p className="text-lg opacity-90">
          Let's dive right into the world of knowledge
        </p>
      </div>
      {resources.length === 0 ? (
        <p>No resources found for this module.</p>
      ) : (
        <ul className="space-y-4 ">
          {resources.map(resource => (
            <li key={resource.id} className="border-none rounded p-4 shadow-sm hover:scale-102 transition-transform duration-300">
              <h2 className="text-xl font-semibold">{resource.title}</h2>
              <p className="text-gray-700 mb-2">{resource.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Type: {resource.resource_type} | Duration: {resource.duration}
              </p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Resource
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Resources;
