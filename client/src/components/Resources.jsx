import React from "react";
import { useParams, Link } from "react-router-dom";
import { FileText, Video, Link as LinkIcon } from "lucide-react";

const mockModule = {
  id: 1,
  title: "Cyber Hygiene 101",
  description: "Learn the basics of staying safe online.",
  level: "Beginner",
  duration: "10 mins",
  progress: 40,
  resources: [
    {
      id: 1,
      type: "video",
      title: "What is Phishing?",
      description: "A quick video overview of phishing attacks.",
      link: "#",
    },
    {
      id: 2,
      type: "pdf",
      title: "Safe Password Guide",
      description: "A downloadable guide to creating strong passwords.",
      link: "#",
    },
    {
      id: 3,
      type: "article",
      title: "Top 10 Cyber Hygiene Tips",
      description: "Stay safer with these everyday practices.",
      link: "#",
    },
  ],
};

const iconMap = {
  video: <Video className="w-5 h-5 text-blue-600" />,
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  article: <LinkIcon className="w-5 h-5 text-green-600" />,
};

const Resources = () => {
  const { id } = useParams(); // You can use this to fetch actual data later

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/learn" className="text-blue-500 hover:underline">← Back to Learn Zone</Link>
      </div>

      {/* Module Info */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{mockModule.title}</h1>
        <p className="text-gray-700 mb-3">{mockModule.description}</p>
        <div className="flex gap-4 text-sm text-gray-600 mb-2">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{mockModule.level}</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">{mockModule.duration}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${mockModule.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{mockModule.progress}% complete</p>
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {mockModule.resources.map((res) => (
          <div key={res.id} className="bg-white p-5 rounded-xl shadow-md flex items-start gap-4">
            <div className="flex-shrink-0">{iconMap[res.type]}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{res.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{res.description}</p>
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline"
              >
                Open Resource →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz CTA */}
      <div className="text-center mt-10">
        <p className="text-lg font-medium mb-3">🎯 Ready to test what you’ve learned?</p>
        <Link
          to={`/quiz?moduleId=${mockModule.id}`}
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
        >
          Take Quiz
        </Link>
      </div>
    </div>
  );
};

export default Resources;
