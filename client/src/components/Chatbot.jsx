import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [optionLabels, setOptionLabels] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // <-- NEW: track if chatbot is open

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // Fetch chatbot node
  const fetchNode = async (nodeId, showQuestion = true) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/chatbot/node/${nodeId}`);
      const node = res.data;

      setCurrentNode(node);

      setChat((prev) => [
        ...prev,
        ...(showQuestion && node.question ? [{ type: "bot", content: node.question }] : []),
        ...(node.answer ? [{ type: "bot", content: node.answer }] : []),
        ...(node.follow_up ? [{ type: "bot", content: node.follow_up }] : []),
      ]);

      // Load option labels for buttons
      const labels = {};
      for (const optId of node.options) {
        const optRes = await axios.get(`http://localhost:5000/api/chatbot/node/${optId}`);
        labels[optId] = optRes.data.question;
      }
      setOptionLabels(labels);
    } catch (err) {
      console.error("Error loading node:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle option click from user
  const handleOptionClick = (nodeId) => {
    setChat((prev) => [
      ...prev,
      { type: "user", content: optionLabels[nodeId] || "..." },
    ]);
    fetchNode(nodeId, false); // Don't repeat question as bot
  };

  // When chatbot is opened or closed
  useEffect(() => {
    if (isOpen) {
      fetchNode("start");
    } else {
      // Optional: clear chat on close, or comment out if you want to keep chat
      setChat([]);
      setCurrentNode(null);
      setOptionLabels({});
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle button to open/close chatbot */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-5 right-5 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chatbot window, shown only when open */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-full max-w-sm p-4 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
          <div className="text-xl font-semibold mb-2 text-indigo-600"> <img src="./images/Cybergenie_logo.png" alt="logo" className="h-9 w-9" /></div>
          <div className="h-64 overflow-y-auto flex flex-col gap-2 mb-3 pr-1">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-sm max-w-xs ${
                  msg.type === "bot"
                    ? "bg-indigo-100 text-gray-800 self-start"
                    : "bg-indigo-500 text-white self-end"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {loading && <div className="text-gray-400 text-sm">Loading...</div>}

          {!loading && currentNode?.options?.length > 0 && (
            <div className="flex flex-col gap-2">
              {currentNode.options.map((optionId, i) => (
                <button
                  key={i}
                  className="text-left bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-sm transition"
                  onClick={() => handleOptionClick(optionId)}
                >
                  {optionLabels[optionId]}
                </button>
              ))}
            </div>
          )}

          {!loading && (!currentNode?.options || currentNode.options.length === 0) && (
            <div className="text-gray-500 text-sm text-center mt-2">
              🤖 I'm glad I could help. Stay safe!
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
