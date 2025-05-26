const express = require('express');
const router = express.Router();
const db = require('../config/db');
const resourceRoutes = require('./resources');

router.use('/', resourceRoutes); 

// Get all learning modules
router.get("/modules", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM learning_modules");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single module by id
router.get("/modules/:id", async (req, res) => {
  try {
    const moduleId = req.params.id;
    const [rows] = await db.query("SELECT * FROM learning_modules WHERE id = ?", [moduleId]);
    if (rows.length === 0) return res.status(404).json({ message: "Module Not Found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user progress
router.get("/progress/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = `
      SELECT lm.id AS module_id, lm.title, up.progress_percent, up.completed_at
      FROM learning_modules lm
      LEFT JOIN user_progress up ON lm.id = up.module_id AND up.user_id = ?`;
    const [rows] = await db.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or create progress
router.post("/progress", async (req, res) => {
  try {
    const { user_id, module_id, progress_percent } = req.body;
    if (!user_id || !module_id || progress_percent == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO user_progress (user_id, module_id, progress_percent, completed_at)
      VALUES (?, ?, ?, CASE WHEN ? = 100 THEN NOW() ELSE NULL END)
      ON DUPLICATE KEY UPDATE
        progress_percent = VALUES(progress_percent),
        completed_at = CASE WHEN VALUES(progress_percent) = 100 THEN NOW() ELSE completed_at END
    `;

    await db.query(query, [user_id, module_id, progress_percent, progress_percent]);
    res.json({ message: "Progress updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
