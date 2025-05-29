// routes/resourceProgress.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Mark a resource as viewed
router.post('/view', async (req, res) => {
  const { user_id, resource_id } = req.body;
  try {
    await db.query(
      `INSERT IGNORE INTO resource_progress (user_id, resource_id) VALUES (?, ?)`,
      [user_id, resource_id]
    );
    res.status(200).json({ message: 'Resource marked as viewed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record resource progress' });
  }
});

// Get viewed resources for a user and module
router.get('/:userId/module/:moduleId', async (req, res) => {
  const { userId, moduleId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT rp.resource_id FROM resource_progress rp
       JOIN learning_resources lr ON rp.resource_id = lr.id
       WHERE rp.user_id = ? AND lr.module_id = ?`,
      [userId, moduleId]
    );
    res.json(rows.map(row => row.resource_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch viewed resources' });
  }
});

module.exports = router;