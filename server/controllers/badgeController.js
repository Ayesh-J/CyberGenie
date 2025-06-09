// controllers/badges.js
const db = require('../config/db');

// Define badge logic
const badgeRules = [
  {
    name: "Cyber Champ",
    condition: async (userId) => {
      const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM quizzes');
      const [[{ completed }]] = await db.query('SELECT COUNT(DISTINCT quiz_id) AS completed FROM quiz_results WHERE user_id = ?', [userId]);
      return completed === total;
    }
  },
  {
    name: "First Quiz",
    condition: async (userId) => {
      const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM quiz_results WHERE user_id = ?', [userId]);
      return count >= 1;
    }
  },
  {
    name: "80% Achiever",
    condition: async (userId) => {
      const [rows] = await db.query('SELECT score FROM quiz_results WHERE user_id = ?', [userId]);
      return rows.some(r => r.score >= 4);
    }
  },
  {
    name: "Module Master",
    condition: async (userId) => {
      const [rows] = await db.query('SELECT score FROM quiz_results WHERE user_id = ?', [userId]);
      return rows.some(r => r.score === 5);
    }
  },
  {
    name: "Consistent Learner",
    condition: async (userId) => {
      const [[{ modules }]] = await db.query('SELECT COUNT(DISTINCT quizzes.module_id) AS modules FROM quiz_results JOIN quizzes ON quiz_results.quiz_id = quizzes.id WHERE quiz_results.user_id = ?', [userId]);
      return modules >= 3;
    }
  },
  {
    name: "LearnZone Starter",
    condition: async (userId) => {
      const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM user_progress WHERE user_id = ? AND progress_percent = 100', [userId]);
      return count >= 1;
    }
  }
  // Add more rules here later
];

const checkAndAwardBadges = async (userId) => {
  const newlyAwarded = [];

  try {
    for (const rule of badgeRules) {
      const [badgeRows] = await db.query('SELECT id FROM badges WHERE name = ?', [rule.name]);
      const badgeId = badgeRows[0]?.id;
      if (!badgeId) continue;

      const [existing] = await db.query('SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?', [userId, badgeId]);
      if (existing.length === 0) {
        const eligible = await rule.condition(userId);
        if (eligible) {
          await db.query('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeId]);
          console.log(`🏅 Awarded "${rule.name}" to user ${userId}`);
          newlyAwarded.push(rule.name);
        }
      }
    }

    return newlyAwarded.length ? newlyAwarded : null;

  } catch (err) {
    console.error("Badge awarding error:", err);
    return null;
  }
};

module.exports = { checkAndAwardBadges };
