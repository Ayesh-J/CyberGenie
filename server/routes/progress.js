const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Auto-calculate progress for all modules for a user
async function calculateUserProgress(userId) {
  const [modules] = await db.query(`SELECT id FROM learning_modules`);

  for (const { id: moduleId } of modules) {
    // Get total resources in the module
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM learning_resources WHERE module_id = ?`,
      [moduleId]
    );

    if (total === 0) continue; // skip if no resources

    // Get number of viewed resources
    const [[{ viewed }]] = await db.query(
      `SELECT COUNT(*) AS viewed FROM resource_progress
       WHERE user_id = ? AND resource_id IN 
         (SELECT id FROM learning_resources WHERE module_id = ?)`,
      [userId, moduleId]
    );

    const progress_percent = Math.round((viewed / total) * 100);
    const is_completed = progress_percent >= 100;
    const completed_at = is_completed ? new Date() : null;

    // Upsert into user_progress
    const [existing] = await db.query(
      `SELECT id FROM user_progress WHERE user_id = ? AND module_id = ?`,
      [userId, moduleId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE user_progress 
         SET progress_percent = ?, is_completed = ?, completed_at = ?, updated_at = NOW()
         WHERE user_id = ? AND module_id = ?`,
        [progress_percent, is_completed, completed_at, userId, moduleId]
      );
    } else {
      await db.query(
        `INSERT INTO user_progress 
         (user_id, module_id, progress_percent, is_completed, completed_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, moduleId, progress_percent, is_completed, completed_at]
      );
    }
  }
}

// 🔁 Updated route to include auto-calculation
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await calculateUserProgress(userId); // <-- 🔁 Calculate first

    const [rows] = await db.query(
      'SELECT user_id, module_id, progress_percent, is_completed FROM user_progress WHERE user_id = ?',
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// 👇 The rest of your routes remain the same
router.get('/:userId/:moduleId', async (req, res) => {
  const { userId, moduleId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT user_id, module_id, progress_percent, is_completed FROM user_progress WHERE user_id = ? AND module_id = ?',
      [userId, moduleId]
    );
    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.json({ user_id: userId, module_id: moduleId, progress_percent: 0, is_completed: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch module progress' });
  }
});

router.put('/:userId/:moduleId', async (req, res) => {
  const { userId, moduleId } = req.params;
  const { progress_percent } = req.body;

  if (typeof progress_percent !== "number") {
    return res.status(400).json({ error: "Missing or invalid progress_percent" });
  }

  try {
    const is_completed = progress_percent >= 100;
    const completed_at = is_completed ? new Date() : null;

    const [existing] = await db.query(
      'SELECT id FROM user_progress WHERE user_id = ? AND module_id = ?',
      [userId, moduleId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE user_progress 
         SET progress_percent = ?, is_completed = ?, completed_at = ?, updated_at = NOW()
         WHERE user_id = ? AND module_id = ?`,
        [progress_percent, is_completed, completed_at, userId, moduleId]
      );
    } else {
      await db.query(
        `INSERT INTO user_progress 
         (user_id, module_id, progress_percent, is_completed, completed_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, moduleId, progress_percent, is_completed, completed_at]
      );
    }

    res.json({ message: 'Progress updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
