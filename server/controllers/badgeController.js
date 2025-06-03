// controllers/badges.js
const db = require('../config/db');

const checkAndAwardBadges = async (userId) => {
  try {
    // Get total number of quizzes
    const [quizCountResult] = await db.execute(
      'SELECT COUNT(*) AS total FROM quizzes'
    );
    const totalQuizzes = quizCountResult[0].total;

    // Get how many unique quizzes the user completed
    const [userCompletedResult] = await db.execute(
      'SELECT COUNT(DISTINCT quiz_id) AS completed FROM quiz_results WHERE user_id = ?',
      [userId]
    );
    const completed = userCompletedResult[0].completed;

    // Check if the user should be awarded "Cyber Champ"
    if (completed === totalQuizzes) {
      const [badgeRow] = await db.execute(
        'SELECT id FROM badges WHERE name = ?',
        ['Cyber Champ']
      );
      const badgeId = badgeRow[0]?.id;
      if (!badgeId) return false;

      // Check if the user already has it
      const [existing] = await db.execute(
        'SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?',
        [userId, badgeId]
      );
      if (existing.length === 0) {
        await db.execute(
          'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
          [userId, badgeId]
        );
        console.log(`🏅 Awarded "Cyber Champ" to user ${userId}`);
        return true;
      }
    }

    return false;
  } catch (err) {
    console.error('Badge awarding error:', err);
    return false;
  }
};

module.exports = { checkAndAwardBadges };
