  const express = require('express');
  const router = express.Router();
  const db = require('../config/db');
const { checkAndAwardBadges } = require('../controllers/badgeController');
  // GET quiz questions and options by module ID
  router.get('/quizzes/:moduleId', async (req, res) => {
    const moduleId = req.params.moduleId;

    try {
      // Get the quiz
      const [quizzes] = await db.query('SELECT * FROM quizzes WHERE module_id = ?', [moduleId]);
      if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });

      const quiz = quizzes[0];

      // Get questions for the quiz
      const [questions] = await db.query('SELECT * FROM quiz_questions WHERE quiz_id = ?', [quiz.id]);

      // Get options for each question
      const questionIds = questions.map(q => q.id);
      let options = [];

      if (questionIds.length > 0) {
        [options] = await db.query('SELECT * FROM quiz_options WHERE question_id IN (?)', [questionIds]);
      }

      // Group options by question ID
      const optionsByQuestion = {};
      options.forEach(opt => {
        if (!optionsByQuestion[opt.question_id]) optionsByQuestion[opt.question_id] = [];
        optionsByQuestion[opt.question_id].push({
          id: opt.id,
          option_text: opt.option_text,
          is_correct: opt.is_correct // ✅ Now included
        });
      });

      // Structure the response
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

  router.post('/submit', async (req, res) => {
    console.log('Request body on submit:', req.body);
    const { userId, moduleId, score } = req.body;
    const PASSING_SCORE = 3;
    const awarded = await checkAndAwardBadges(userId);

    try {
      if (!userId || !moduleId || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      // 1. Find quiz ID for the given moduleId
      const [quizzes] = await db.query(
        'SELECT id FROM quizzes WHERE module_id = ? LIMIT 1',
        [moduleId]
      );

      if (quizzes.length === 0) {
        return res.status(404).json({ error: 'Quiz not found for this module' });
      }

      const quizId = quizzes[0].id;

      // 2. Insert or update quiz result with correct quizId
      await db.query(
        `INSERT INTO quiz_results (user_id, quiz_id, score)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE score = VALUES(score)`,
        [userId, quizId, score]
      );

      
       
      

      
      // 3. Update user progress if passing score reached
      if (score >= PASSING_SCORE) {
        await db.query(
          `UPDATE user_progress SET progress_percent = 100 WHERE user_id = ? AND module_id = ?`,
          [userId, moduleId]
        );
      }

   

       
    } catch (err) {
      console.error('Error in /submit:', err);
      res.status(500).json({ error: "Server error" });
    }
  });

  module.exports = router;
