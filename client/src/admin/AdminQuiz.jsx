import React, { useEffect, useState } from "react";
import api from "../utilities/api";
import { PlusCircle, Save, Trash2, CheckCircle } from "lucide-react";

const QuizEditor = () => {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      const res = await api.get("/admin/modules");
      setModules(res.data);
    };
    fetchModules();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedModuleId) return;
      setLoading(true);
      const res = await api.get(`/admin/quizzes/${selectedModuleId}/questions`);
      setQuestions(res.data.questions);
      setLoading(false);
    };
    fetchQuestions();
  }, [selectedModuleId]);

  const handleAddQuestion = async () => {
    const res = await api.post("/admin/questions", {
      quizId: selectedModuleId,
      questionText: "New Question",
    });
    setQuestions([...questions, { id: res.data.id, question_text: "New Question", options: [] }]);
  };

  const handleQuestionTextChange = (qid, newText) => {
    setQuestions(prev =>
      prev.map(q => (q.id === qid ? { ...q, question_text: newText } : q))
    );
  };

  const handleSaveQuestion = async (qid, questionText) => {
    await api.put(`/admin/questions/${qid}`, { questionText });
  };

  const handleDeleteQuestion = async (qid) => {
    await api.delete(`/admin/questions/${qid}`);
    setQuestions(prev => prev.filter(q => q.id !== qid));
  };

  const handleAddOption = async (qid) => {
    const res = await api.post("/admin/options", {
      questionId: qid,
      optionText: "New Option",
      isCorrect: false,
    });
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid
          ? { ...q, options: [...q.options, { id: res.data.id, option_text: "New Option", is_correct: 0 }] }
          : q
      )
    );
  };

  const handleOptionChange = (qid, oid, field, value) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map(o =>
                o.id === oid ? { ...o, [field]: value } : o
              ),
            }
          : q
      )
    );
  };

  const handleSaveOption = async (oid, option) => {
    await api.put(`/admin/options/${oid}`, {
      optionText: option.option_text,
      isCorrect: option.is_correct,
    });
  };

  const handleDeleteOption = async (qid, oid) => {
    await api.delete(`/admin/options/${oid}`);
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid
          ? { ...q, options: q.options.filter(o => o.id !== oid) }
          : q
      )
    );
  };

  return (
    <div className="w-full min-h-screen px-10 py-10 bg-gradient-to-br from-[#0e0e2c] to-[#1f1f3a] text-white">
      <h1 className="text-4xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
        🧠 Quiz Editor
      </h1>

      <select
        className="mb-8 w-full px-4 py-3 bg-[#14142b] border border-indigo-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
        value={selectedModuleId || ""}
        onChange={(e) => setSelectedModuleId(e.target.value)}
      >
        <option value="" disabled>Select a module to edit quiz</option>
        {modules.map((mod) => (
          <option key={mod.id} value={mod.id}>
            {mod.title}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-gray-300">Loading questions...</p>
      ) : (
        <>
          {questions.map((q) => (
            <div
              key={q.id}
              className="mb-6 p-6 bg-[#1a1a33] rounded-xl border border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <input
                type="text"
                value={q.question_text}
                onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                className="w-full px-4 py-2 bg-[#2b2b45] text-white border border-indigo-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3 mb-4">
                <button onClick={() => handleSaveQuestion(q.id, q.question_text)} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
                  <CheckCircle size={18} /> Save
                </button>
                <button onClick={() => handleDeleteQuestion(q.id)} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
                  <Trash2 size={18} /> Delete
                </button>
              </div>

              <h4 className="text-indigo-300 font-semibold mb-2">Options:</h4>
              {q.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-3 mb-2">
                  <input
                    type="text"
                    value={opt.option_text}
                    onChange={(e) =>
                      handleOptionChange(q.id, opt.id, "option_text", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-[#2c2c48] text-white rounded border border-indigo-300"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!opt.is_correct}
                      onChange={(e) =>
                        handleOptionChange(q.id, opt.id, "is_correct", e.target.checked ? 1 : 0)
                      }
                    />
                    Correct
                  </label>
                  <button
                    onClick={() => handleSaveOption(opt.id, opt)}
                    className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDeleteOption(q.id, opt.id)}
                    className="px-3 py-1 text-sm bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddOption(q.id)}
                className="mt-3 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <PlusCircle size={18} /> Add Option
              </button>
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            className="w-full mt-8 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-lg font-medium hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <PlusCircle /> Add New Question
          </button>
        </>
      )}
    </div>
  );
};

export default QuizEditor;
