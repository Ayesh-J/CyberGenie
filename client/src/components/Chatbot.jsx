import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; 
import {ThumbsUp, ThumbsDown} from 'lucide-react';

const Chatbot = () => {
  const [chat, setChat] = useState(() => {
    try {
      const saved = localStorage.getItem("cybergenie_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentNode, setCurrentNode] = useState(null);
  const [optionLabels, setOptionLabels] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    localStorage.setItem("cybergenie_chat_history", JSON.stringify(chat));
  }, [chat]);

  const fetchNode = async (nodeId, showQuestion = true) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/chatbot/node/${nodeId}`);
      const node = res.data;
      setCurrentNode(node);

      const newMessages = [
        ...(showQuestion && node.question ? [{ type: "bot", content: node.question }] : []),
        ...(node.answer ? [{ type: "bot", content: node.answer }] : []),
        ...(node.follow_up ? [{ type: "bot", content: node.follow_up }] : []),
      ];
      setChat((prev) => [...prev, ...newMessages]);

      const labels = {};
      for (const optId of node.options) {
        const optRes = await axios.get(`http://localhost:5000/api/chatbot/node/${optId}`);
        labels[optId] = optRes.data.question;
      }
      setOptionLabels(labels);

      setShowFeedback(!node.options || node.options.length === 0);
    } catch (err) {
      console.error("Error loading node:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (nodeId) => {
    setChat((prev) => [...prev, { type: "user", content: optionLabels[nodeId] || "..." }]);
    fetchNode(nodeId, false);
  };

  const handleFeedback = (isHelpful) => {
    setChat((prev) => [
      ...prev,
      {
        type: "system",
        content: isHelpful
          ? " Thanks for your feedback!"
          : " Sorry to hear that. We'll improve!",
      },
    ]);
    setShowFeedback(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (chat.length === 0) {
        fetchNode("start");
      }
    } else {
      setChat([]);
      setCurrentNode(null);
      setOptionLabels({});
      setShowFeedback(false);
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-indigo-500/50"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.6 9.6 0 01-4.906-1.295L3 20l1.295-4.906A9.6 9.6 0 013 12c0-4.97 3.582-9 8-9s9 4.03 9 9z"
            />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-full max-w-sm h-[480px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700">
              <img src="/images/Cybergenie_logo.png" alt="logo" className="h-10 w-10 rounded-full border-2 border-white" />
              <h2 className="text-white font-semibold text-lg select-none">CyberGenie Chatbot</h2>
            </div>

            <div className="flex-1 px-5 py-4 overflow-y-auto bg-gray-50 space-y-3 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
              {chat.length === 0 && !loading && (
                <p className="text-center text-gray-400 italic select-none">No messages yet. Start by selecting an option below.</p>
              )}

              {chat.map((msg, idx) => {
                const variants = {
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                };

                return (
                  <motion.div
                    key={idx}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    variants={variants}
                    className={
                      msg.type === "bot"
                        ? "max-w-[80%] bg-white text-gray-800 shadow-md self-start px-4 py-2 rounded-2xl text-sm break-words"
                        : msg.type === "user"
                        ? "max-w-[80%] bg-indigo-600 text-white shadow-lg self-end px-4 py-2 rounded-2xl text-sm break-words"
                        : "max-w-[70%] mx-auto text-center italic text-indigo-600 text-sm select-none"
                    }
                  >
                    {msg.content}
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {loading && (
              <div className="flex items-center gap-2 px-5 py-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce animation-delay-0"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce animation-delay-400"></div>
                <span className="text-indigo-500 font-medium text-sm ml-2">Typing...</span>
              </div>
            )}

            {!loading && currentNode?.options?.length > 0 && (
              <div className="px-5 pb-5 pt-3 bg-white border-t border-gray-200 flex flex-col gap-3">
                {currentNode.options.map((optionId, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleOptionClick(optionId)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold rounded-xl py-3 px-4 text-left shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {optionLabels[optionId]}
                  </motion.button>
                ))}
              </div>
            )}

            {!loading && (!currentNode?.options || currentNode.options.length === 0) && (
              <>
                <div className="p-4 text-center text-gray-500 italic text-sm select-none border-t border-gray-200">
                  I'm glad I could help. Stay safe!
                </div>
                {showFeedback && (
                  <div className="flex justify-center gap-6 p-3 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => handleFeedback(true)}
                      aria-label="Helpful"
                      className="text-green-600 hover:text-green-800 transition-colors text-2xl focus:outline-none"
                    >
                      <ThumbsUp/>
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      aria-label="Not helpful"
                      className="text-red-600 hover:text-red-800 transition-colors text-2xl focus:outline-none"
                    >
                      <ThumbsDown/>
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>
    </>
  );
};

export default Chatbot;
