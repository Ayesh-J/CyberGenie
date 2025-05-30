import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [optionLabels, setOptionLabels] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

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

  const handleOptionClick = (nodeId) => {
    setChat((prev) => [
      ...prev,
      { type: "user", content: optionLabels[nodeId] || "..." },
    ]);
    fetchNode(nodeId, false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNode("start");
    } else {
      setChat([]);
      setCurrentNode(null);
      setOptionLabels({});
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-transform active:scale-90"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <span className="sr-only">{isOpen ? "Close chatbot" : "Open chatbot"}</span>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.6 9.6 0 01-4.906-1.295L3 20l1.295-4.906A9.6 9.6 0 013 12c0-4.97 3.582-9 8-9s9 4.03 9 9z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[480px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <img
              src="./images/Cybergenie_logo.png"
              alt="logo"
              className="h-10 w-10 rounded-full border-2 border-white"
            />
            <h2 className="text-white font-semibold text-lg select-none">
              CyberGenie Chatbot
            </h2>
          </div>

          {/* Messages container */}
          <div className="flex-1 px-5 py-4 overflow-y-auto space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200">
            {chat.length === 0 && !loading && (
              <p className="text-center text-gray-400 italic select-none">
                No messages yet. Start by selecting an option below.
              </p>
            )}
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm break-words ${
                  msg.type === "bot"
                    ? "bg-white text-gray-800 shadow-md self-start"
                    : "bg-indigo-600 text-white shadow-lg self-end"
                }`}
                style={{ wordWrap: "break-word" }}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center text-indigo-500 font-medium text-sm py-2 animate-pulse">
              Loading...
            </div>
          )}

          {/* Options */}
          {!loading && currentNode?.options?.length > 0 && (
            <div className="px-5 pb-5 pt-3 bg-white border-t border-gray-200 flex flex-col gap-3">
              {currentNode.options.map((optionId, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(optionId)}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold rounded-xl py-3 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {optionLabels[optionId]}
                </button>
              ))}
            </div>
          )}

          {/* End message */}
          {!loading && (!currentNode?.options || currentNode.options.length === 0) && (
            <div className="p-4 text-center text-gray-500 italic text-sm select-none border-t border-gray-200">
              I'm glad I could help. Stay safe!
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
