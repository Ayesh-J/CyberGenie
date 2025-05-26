const express = require('express');
const router = express.Router();
const db = require("../config/db");

// GET /api/learnzone/:moduleId/resources
router.get('/:moduleId/resources', (req, res) => {
    const moduleId = req.params.moduleId;
    const query = 'SELECT * FROM learning_resources WHERE module_id = ?';

    db.query(query, [moduleId], (err, results) => {
        if (err) {
            console.error('Error fetching resources:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

module.exports = router;
