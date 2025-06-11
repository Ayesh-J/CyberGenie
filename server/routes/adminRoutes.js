const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ✅ 1. GET admin dashboard stats
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [[{ total_users }]] = await db.execute("SELECT COUNT(*) AS total_users FROM users");
    const [[{ total_modules }]] = await db.execute("SELECT COUNT(*) AS total_modules FROM learning_modules");
    const [[{ total_quizzes }]] = await db.execute("SELECT COUNT(*) AS total_quizzes FROM quizzes");

    res.json({
      total_users,
      total_modules,
      total_quizzes,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ 2. GET all modules
router.get("/modules", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [modules] = await db.query("SELECT * FROM learning_modules ORDER BY id DESC");
    res.json(modules);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

// ✅ 3. POST /api/admin/modules - Add a new learning module
router.post("/modules", authMiddleware, adminOnly, async (req, res) => {
  const { title, description, image } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "INSERT INTO learning_modules (title, description, image_url) VALUES (?, ?, ?)",
      [title, description, image]
    );

    res.status(201).json({ message: "Module added successfully" });
  } catch (err) {
    console.error("Error adding module:", err);
    res.status(500).json({ error: "Failed to add module" });
  }
});

// ✅ 4. PUT /api/admin/modules/:id - Edit a module
router.put("/modules/:id", authMiddleware, adminOnly, async (req, res) => {
  const { title, description, image } = req.body;
  const { id } = req.params;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "UPDATE learning_modules SET title = ?, description = ?, image_url = ? WHERE id = ?",
      [title, description, image, id]
    );
    res.json({ message: "Module updated successfully" });
  } catch (err) {
    console.error("Error updating module:", err);
    res.status(500).json({ error: "Failed to update module" });
  }
});

// ✅ 5. DELETE /api/admin/modules/:id - Delete a module
router.delete("/modules/:id", authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM learning_modules WHERE id = ?", [id]);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("Error deleting module:", err);
    res.status(500).json({ error: "Failed to delete module" });
  }
});

// ✅ 6. POST /modules/:id/resources - Add a resource to a module
router.post("/modules/:id/resources", authMiddleware, adminOnly, async (req, res) => {
  const { id: moduleId } = req.params;
  const { title, description, type, url } = req.body;

  if (!title || !description || !type || !url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "INSERT INTO learning_resources (module_id, title, description, resource_type, url) VALUES (?, ?, ?, ?, ?)",
      [moduleId, title, description, type, url]
    );

    res.status(201).json({ message: "Resource added successfully" });
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({ error: "Failed to add resource" });
  }
});

module.exports = router;
