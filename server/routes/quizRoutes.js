const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkAndAwardBadges } = require('../controllers/badgeController');

// GET quiz by module ID
router.get('/quizzes/:moduleId', async (req, res) => {
  const moduleId = req.params.moduleId;
  const excludeIds = req.query.excludeIds ? req.query.excludeIds.split(',').map(id => parseInt(id)) : [];

  try {
    const [quizzes] = await db.query('SELECT * FROM quizzes WHERE module_id = ?', [moduleId]);
    if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });

    const quiz = quizzes[0];

    let query = 'SELECT * FROM quiz_questions WHERE quiz_id = ?';
    const queryParams = [quiz.id];

    if (excludeIds.length > 0) {
      const placeholders = excludeIds.map(() => '?').join(',');
      query += ` AND id NOT IN (${placeholders})`;
      queryParams.push(...excludeIds);
    }

    query += ' ORDER BY RAND() LIMIT 5';

    const [questions] = await db.query(query, queryParams);

    const questionIds = questions.map(q => q.id);
    let options = [];

    if (questionIds.length > 0) {
      [options] = await db.query('SELECT * FROM quiz_options WHERE question_id IN (?)', [questionIds]);
    }

    const optionsByQuestion = {};
    options.forEach(opt => {
      if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
      optionsByQuestion[opt.question_id].push({
        id: opt.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct
      });
    });

    const questionsWithOptions = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: optionsByQuestion[q.id] || []
    }));

    res.json({
      quiz: {
        id: quiz.id,
        module_id: quiz.module_id,
        title: quiz.title,
        total_questions: quiz.total_questions,
        questions: questionsWithOptions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST quiz results
router.post('/submit', async (req, res) => {
  const { userId, moduleId, score } = req.body;
  const PASSING_SCORE = 3;

  try {
    if (!userId || !moduleId || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [quizzes] = await db.query(
      'SELECT id FROM quizzes WHERE module_id = ? LIMIT 1',
      [moduleId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ error: 'Quiz not found for this module' });
    }

    const quizId = quizzes[0].id;

    await db.query(
      `INSERT INTO quiz_results (user_id, quiz_id, score)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score)`,
      [userId, quizId, score]
    );

    if (score >= PASSING_SCORE) {
      await db.query(
        `UPDATE user_progress SET progress_percent = 100 WHERE user_id = ? AND module_id = ?`,
        [userId, moduleId]
      );
    }

    const awardedBadges = await checkAndAwardBadges(userId);

    res.json({
      message: "Quiz submitted successfully",
      badgeAwarded: awardedBadges || [],
    });
  } catch (err) {
    console.error('Error in /submit:', err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
