import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Video,
  Image as ImageIcon,
  Link2,
  Loader2
} from "lucide-react";

const AdminContent = () => {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: "", description: "", image: "" });
  const [resourceInputs, setResourceInputs] = useState({});
  const [showResources, setShowResources] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem("token");

  const fetchModules = async () => {
    try {
      const res = await axios.get("/api/admin/modules", {
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
      await axios.post("/api/admin/modules", newModule, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewModule({ title: "", description: "", image: "" });
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
    if (!values.title || !values.description || !values.image_url) {
      return alert("All fields are required.");
    }

    try {
      await axios.put(`/api/admin/modules/${id}`, {
        title: values.title,
        description: values.description,
        image: values.image_url,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditMode((prev) => ({ ...prev, [id]: false }));
      fetchModules();
    } catch (err) {
      console.error("Error saving module:", err);
      alert("Failed to save changes");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await axios.delete(`/api/admin/modules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchModules();
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Failed to delete module");
    }
  };

  const handleToggleResources = (moduleId) => {
    setShowResources((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleResourceChange = (moduleId, field, value) => {
    setResourceInputs((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }));
  };

  const handleAddResource = async (moduleId) => {
    const resource = resourceInputs[moduleId];
    if (!resource?.title || !resource?.url || !resource?.type) {
      return alert("All fields are required for the resource.");
    }

    try {
      await axios.post(`/api/admin/modules/${moduleId}/resources`, resource, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResourceInputs((prev) => ({ ...prev, [moduleId]: {} }));
      fetchModules();
    } catch (err) {
      console.error("Error adding resource:", err);
      alert("Failed to add resource");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="p-8">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-gray-800"
      >
        Manage Learning Modules
      </motion.h2>

      {/* Add Module Form */}
      <motion.form 
        onSubmit={handleAddModule}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4 bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Module Title</label>
          <input
            type="text"
            placeholder="Enter module title"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Enter module description"
            value={newModule.description}
            onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Image URL</label>
          <div className="flex items-center gap-2">
            <ImageIcon className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={newModule.image}
              onChange={(e) => setNewModule({ ...newModule, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Adding...
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Module
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Display Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {modules.map((module) => {
            const isEditing = editMode[module.id];
            const edit = editValues[module.id] || {};

            return (
              <motion.div
                key={module.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              >
                {isEditing ? (
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={edit.title}
                      onChange={(e) => handleEditChange(module.id, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={edit.description}
                      onChange={(e) => handleEditChange(module.id, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Link2 size={16} className="text-gray-400" />
                      <input
                        type="text"
                        value={edit.image_url}
                        onChange={(e) => handleEditChange(module.id, "image_url", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={module.image_url} 
                        alt={module.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{module.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                    </div>
                  </>
                )}

                <div className="px-4 pb-4">
                  <div className="flex justify-end gap-2 mb-3">
                    {isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSaveEdit(module.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
                      >
                        <Save size={16} />
                        Save
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditClick(module)}
                        className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-lg text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(module.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={() => handleToggleResources(module.id)}
                    className="flex items-center gap-1 text-blue-600 text-sm font-medium"
                  >
                    {showResources[module.id] ? (
                      <>
                        <ChevronUp size={16} />
                        Hide Resources
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Manage Resources
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showResources[module.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pt-3 border-t"
                      >
                        <h4 className="font-medium text-gray-700 mb-2">Add Resource</h4>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Resource title"
                            value={resourceInputs[module.id]?.title || ""}
                            onChange={(e) => handleResourceChange(module.id, "title", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                          />
                          <textarea
                            placeholder="Description"
                            value={resourceInputs[module.id]?.description || ""}
                            onChange={(e) => handleResourceChange(module.id, "description", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                            rows={2}
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={resourceInputs[module.id]?.type || ""}
                              onChange={(e) => handleResourceChange(module.id, "type", e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                            >
                              <option value="">Select type</option>
                              <option value="article">
                                <div className="flex items-center gap-1">
                                  <FileText size={14} />
                                  Article
                                </div>
                              </option>
                              <option value="video">
                                <div className="flex items-center gap-1">
                                  <Video size={14} />
                                  Video
                                </div>
                              </option>
                            </select>
                          </div>
                          <input
                            type="text"
                            placeholder="URL"
                            value={resourceInputs[module.id]?.url || ""}
                            onChange={(e) => handleResourceChange(module.id, "url", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                          />
                          <motion.button
                            onClick={() => handleAddResource(module.id)}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-1 w-full justify-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg"
                          >
                            <Plus size={16} />
                            Add Resource
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminContent;