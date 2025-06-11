const db = require('../config/db');

// Badge rules
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
    name: "First Strike",
    condition: async (userId) => {
      const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM quiz_results WHERE user_id = ?', [userId]);
      return count >= 1;
    }
  },
  {
    name: "Perfect Scorer",
    condition: async (userId) => {
      const [rows] = await db.query('SELECT score FROM quiz_results WHERE user_id = ?', [userId]);
      return rows.some(r => r.score === 5);
    }
  },
  {
    name: "Module Master",
    condition: async (userId) => {
      const [[{ count }]] = await db.query(
        'SELECT COUNT(*) AS count FROM quiz_results WHERE user_id = ? AND score = 5',
        [userId]
      );
      return count >= 3;
    }
  },
  {
    name: "Fast Learner",
    condition: async (userId) => {
      const [[{ count }]] = await db.query(
        `SELECT COUNT(*) AS count FROM quiz_results 
         WHERE user_id = ? AND TIMESTAMPDIFF(SECOND, started_at, submitted_at) <= 120`,
        [userId]
      );
      return count >= 1;
    }
  },
  {
    name: "Password Pro",
    condition: async (userId) => {
      const [[{ count }]] = await db.query(
        `SELECT COUNT(*) AS count FROM quiz_results qr 
         JOIN quizzes q ON qr.quiz_id = q.id 
         WHERE q.module_id = 3 AND qr.user_id = ? AND qr.score >= 3`,
        [userId]
      );
      return count >= 1;
    }
  },
  {
    name: "Phishing Phobia",
    condition: async (userId) => {
      const [[{ count }]] = await db.query(
        `SELECT COUNT(*) AS count FROM quiz_results qr 
         JOIN quizzes q ON qr.quiz_id = q.id 
         WHERE q.module_id = 1 AND qr.user_id = ? AND qr.score >= 3`,
        [userId]
      );
      return count >= 1;
    }
  },
  {
    name: "Malware Smasher",
    condition: async (userId) => {
      const [[{ count }]] = await db.query(
        `SELECT COUNT(*) AS count FROM quiz_results qr 
         JOIN quizzes q ON qr.quiz_id = q.id 
         WHERE q.module_id = 4 AND qr.user_id = ? AND qr.score >= 3`,
        [userId]
      );
      return count >= 1;
    }
  },
  {
    name: "Daily Streak",
    condition: async (userId) => {
      const [rows] = await db.query(
        `SELECT DISTINCT DATE(submitted_at) as day 
         FROM quiz_results 
         WHERE user_id = ? 
         ORDER BY day DESC LIMIT 3`,
        [userId]
      );
      if (rows.length < 3) return false;

      const today = new Date();
      for (let i = 0; i < 3; i++) {
        const expected = new Date(today);
        expected.setDate(today.getDate() - i);
        const expectedStr = expected.toISOString().split("T")[0];
        if (!rows.some(r => r.day.toISOString().split("T")[0] === expectedStr)) {
          return false;
        }
      }
      return true;
    }
  },
  {
    name: "Quiz Veteran",
    condition: async (userId) => {
      const [[{ count }]] = await db.query(
        'SELECT COUNT(*) AS count FROM quiz_results WHERE user_id = ?',
        [userId]
      );
      return count >= 10;
    }
  }
];

// Badge awarding function
const checkAndAwardBadges = async (userId) => {
  const newlyAwarded = [];

  try {
    for (const rule of badgeRules) {
      const [badgeRows] = await db.query('SELECT id, name, icon FROM badges WHERE name = ?', [rule.name]);
      const badge = badgeRows[0];
      if (!badge) continue;

      const [existing] = await db.query(
        'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?',
        [userId, badge.id]
      );

      if (existing.length === 0) {
        const eligible = await rule.condition(userId);
        if (eligible) {
          await db.query(
            'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
            [userId, badge.id]
          );
          console.log(`🏅 Awarded "${badge.name}" to user ${userId}`);
          newlyAwarded.push({ name: badge.name, icon: badge.icon });
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
