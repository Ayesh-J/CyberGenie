import React, { useState, useEffect, useRef } from "react";
import { X, Bot, Trash2, User, Loader2 } from "lucide-react";
import genieQA from "../data/genieQA";

const GenieChat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [currentStep, setCurrentStep] = useState("start");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const getStep = (id) => genieQA.find((q) => q.id === id);

  const sendBotMessage = (step) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = step.question || step.answer;
      setChat((prev) => [...prev, { type: "bot", text: botMessage }]);
      setIsTyping(false);

      // Handle followUp and follow-up options
      if (step.followUp) {
        setTimeout(() => {
          setChat((prev) => [...prev, { type: "bot", text: step.followUp }]);
        }, 800);
      }

      // Set options only after follow-up
      if (step.options?.length > 0) {
        setTimeout(() => {
          setCurrentStep(step.id);
        }, step.followUp ? 1200 : 0);
      } else {
        setCurrentStep(null); // Clear current options if none left
      }
    }, 800);
  };

  const handleOptionClick = (option) => {
    const nextStep = getStep(option);
    setChat((prev) => [...prev, { type: "user", text: option }]);
    if (nextStep) {
      sendBotMessage(nextStep);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    const step = getStep("start");
    setChat([{ type: "bot", text: step.question }]);
    setCurrentStep("start");
  };

  const handleClear = () => {
    setChat([]);
    const step = getStep("start");
    setCurrentStep("start");
    sendBotMessage(step);
  };

  const currentOptions = getStep(currentStep)?.options || [];

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, isTyping]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-none text-white p-4 rounded-full shadow-lg z-50"
      >
        <img src="./images/Cybergenie_logo.png" alt="Genie" className="w-20 h-20" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-sm bg-white border border-gray-200 rounded-2xl shadow-xl z-50 flex flex-col h-[550px] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <h2 className="font-semibold text-lg">CyberGenie</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handleClear}><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-3">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-2 rounded-lg shadow max-w-[75%] text-sm ${msg.type === "user" ? "bg-blue-500 text-white" : "bg-blue-100 text-gray-800"}`}>
                  <div className="flex items-start gap-2">
                    {msg.type === "bot" && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                    <span>{msg.text}</span>
                    {msg.type === "user" && <User className="w-4 h-4 mt-1 text-white" />}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Loader2 className="animate-spin w-4 h-4" /> Genie is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Options */}
          {currentOptions.length > 0 && (
            <div className="p-3 bg-white border-t space-y-2">
              {currentOptions.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  className="block w-full text-left px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-sm font-medium border border-blue-200 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GenieChat;
