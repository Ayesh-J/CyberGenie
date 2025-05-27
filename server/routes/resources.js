// routes/resources.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all resources or filter by module_id
router.get('/', async (req, res) => {
  const moduleId = req.query.module_id;

  try {
    const [resources] = moduleId
      ? await db.execute('SELECT * FROM learning_resources WHERE module_id = ?', [moduleId])
      : await db.execute('SELECT * FROM learning_resources');

    res.json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
