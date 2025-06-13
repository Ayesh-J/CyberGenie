import React, { useEffect, useState } from "react";
import api from "../utilities/api";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react";

const AdminContent = () => {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    image_url: "",
  });
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem("token");

  const fetchModules = async () => {
    try {
      const res = await api.get("/admin/modules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(res.data);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await api.post("/admin/modules", newModule, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewModule({ title: "", description: "", image_url: "" });
      await fetchModules();
    } catch (err) {
      console.error("Error adding module:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditClick = (module) => {
    setEditMode((prev) => ({ ...prev, [module.id]: true }));
    setEditValues((prev) => ({
      ...prev,
      [module.id]: {
        title: module.title,
        description: module.description,
        image_url: module.image_url,
      },
    }));
  };

  const handleEditChange = (id, field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveEdit = async (id) => {
    const values = editValues[id];
    try {
      await api.put(
        `/admin/modules/${id}`,
        {
          title: values.title,
          description: values.description,
          image_url: values.image_url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMode((prev) => ({ ...prev, [id]: false }));
      fetchModules();
    } catch (err) {
      console.error("Error saving module:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await api.delete(`/admin/modules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchModules();
    } catch (err) {
      console.error("Error deleting module:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-[#14142b] text-white">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-10 text-indigo-400 tracking-wide"
      >
        CyberGenie Content Manager
      </motion.h1>

      {/* Add Module */}
      <form
        onSubmit={handleAddModule}
        className="bg-[#1d1d3b] border border-indigo-500/20 rounded-2xl p-6 mb-12 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["title", "description", "image_url"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={
                field === "image_url" ? "Image URL" : `Module ${field[0].toUpperCase() + field.slice(1)}`
              }
              value={newModule[field]}
              onChange={(e) => setNewModule({ ...newModule, [field]: e.target.value })}
              className="px-4 py-3 rounded-xl bg-[#2b2b4f] text-white border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isAdding}
          className="mt-6 w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300"
        >
          {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          {isAdding ? "Adding..." : "Add Module"}
        </button>
      </form>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module) => {
          const isEditing = editMode[module.id];
          const edit = editValues[module.id] || {};

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1a1a33] border border-indigo-500/30 rounded-2xl p-5 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={edit.title}
                    onChange={(e) => handleEditChange(module.id, "title", e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#2b2b4f] text-white border border-indigo-400"
                  />
                  <textarea
                    value={edit.description}
                    onChange={(e) => handleEditChange(module.id, "description", e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#2b2b4f] text-white border border-indigo-400"
                  />
                  <input
                    type="text"
                    value={edit.image_url}
                    onChange={(e) => handleEditChange(module.id, "image_url", e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#2b2b4f] text-white border border-indigo-400"
                  />
                  <button
                    onClick={() => handleSaveEdit(module.id)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={module.image_url}
                    alt={module.title}
                    className="w-full h-40 object-cover rounded-xl border border-indigo-600 mb-4 shadow-inner"
                  />
                  <h3 className="text-xl font-semibold text-indigo-300">{module.title}</h3>
                  <p className="text-sm text-gray-300 mt-1 mb-4">{module.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(module)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-3 rounded-xl flex items-center justify-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(module.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminContent;
