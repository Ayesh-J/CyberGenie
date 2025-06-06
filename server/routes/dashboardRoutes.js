const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT email FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json({ email: rows[0].email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get learnzone progress
router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const [totalRows] = await db.execute("SELECT COUNT(*) AS total FROM user_progress");
    const [completedRows] = await db.execute(
      "SELECT COUNT(*) AS completed FROM user_progress WHERE user_id = ? AND is_completed = 1",
      [req.user.id]
    );
    res.json({
      total: totalRows[0].total || 0,
      completed: completedRows[0].completed || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching progress" });
  }
});

// Get total quizzes answered
router.get("/quizzes", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS quizzes_answered FROM quiz_results WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ quizzesAnswered: rows[0].quizzes_answered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching quiz data" });
  }
});

// Get total badges earned
router.get("/badges", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS badges_earned FROM user_badges WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ badgesEarned: rows[0].badges_earned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching badge data" });
  }
});

// Get random cybersecurity tips
router.get("/random", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT fact FROM cyber_facts ORDER BY RAND() LIMIT 5");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching tips" });
  }
});

// Get random cyber alerts
router.get("/alerts", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT title FROM cyber_alerts ORDER BY RAND() LIMIT 5");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching alerts" });
  }
});

// Progress Details: List modules learned by user
router.get('/progress-details', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT m.id, m.title, m.description 
       FROM learning_modules m
       JOIN user_progress up ON m.id = up.module_id
       WHERE up.user_id = ? AND up.is_completed = 1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching progress details' });
  }
});

// Quiz Details: List quizzes answered by user
router.get('/quiz-details', authMiddleware, async (req, res) => {
  try {
    // Assuming quiz_results has quiz_id and quiz title stored in quiz table
    const [rows] = await db.execute(
      `SELECT q.id, q.title, qr.score, qr.completed_at
       FROM quiz_results qr
       JOIN quizzes q ON qr.quiz_id = q.id
       WHERE qr.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching quiz details' });
  }
});

// Badge Details: List badges earned by user
router.get('/badge-details', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.id, b.name, b.description
       FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching badge details' });
  }
});

module.exports = router;
