const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

//  1. GET admin dashboard stats
router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [[{ total_users }]] = await db.execute("SELECT COUNT(*) AS total_users FROM users");
    const [[{ total_modules }]] = await db.execute("SELECT COUNT(*) AS total_modules FROM learning_modules");
    const [[{ total_quizzes }]] = await db.execute("SELECT COUNT(*) AS total_quizzes FROM quizzes");

    res.json({
      total_users,
      total_modules,
      total_quizzes,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  2. GET all modules
router.get("/modules", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [modules] = await db.query("SELECT * FROM learning_modules ORDER BY id DESC");
    res.json(modules);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

//  3. POST /api/admin/modules - Add a new learning module
router.post("/modules", authMiddleware, adminOnly, async (req, res) => {
  const { title, description, image } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "INSERT INTO learning_modules (title, description, image_url) VALUES (?, ?, ?)",
      [title, description, image]
    );

    res.status(201).json({ message: "Module added successfully" });
  } catch (err) {
    console.error("Error adding module:", err);
    res.status(500).json({ error: "Failed to add module" });
  }
});

//  4. PUT /api/admin/modules/:id - Edit a module
router.put("/modules/:id", authMiddleware, adminOnly, async (req, res) => {
  const { title, description, image } = req.body;
  const { id } = req.params;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "UPDATE learning_modules SET title = ?, description = ?, image_url = ? WHERE id = ?",
      [title, description, image, id]
    );
    res.json({ message: "Module updated successfully" });
  } catch (err) {
    console.error("Error updating module:", err);
    res.status(500).json({ error: "Failed to update module" });
  }
});

// 5. DELETE /api/admin/modules/:id - Delete a module
router.delete("/modules/:id", authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM learning_modules WHERE id = ?", [id]);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("Error deleting module:", err);
    res.status(500).json({ error: "Failed to delete module" });
  }
});

// 6. POST /modules/:id/resources - Add a resource to a module
router.post("/modules/:id/resources", authMiddleware, adminOnly, async (req, res) => {
  const { id: moduleId } = req.params;
  const { title, description, type, url } = req.body;

  if (!title || !description || !type || !url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "INSERT INTO learning_resources (module_id, title, description, resource_type, url) VALUES (?, ?, ?, ?, ?)",
      [moduleId, title, description, type, url]
    );

    res.status(201).json({ message: "Resource added successfully" });
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({ error: "Failed to add resource" });
  }
});

//  1. Get all questions with options for a quiz
router.get("/quizzes/:quizId/questions", authMiddleware, adminOnly, async (req, res) => {
  const { quizId } = req.params;

  try {
    const [questions] = await db.execute(
      "SELECT * FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    const questionIds = questions.map(q => q.id);
    let [options] = [ [] ];

    if (questionIds.length > 0) {
      [options] = await db.query(
        `SELECT * FROM quiz_options WHERE question_id IN (${questionIds.map(() => "?").join(",")})`,
        questionIds
      );
    }

    const withOptions = questions.map(q => ({
      ...q,
      options: options.filter(o => o.question_id === q.id),
    }));

    res.json({ questions: withOptions });
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// POST /api/admin/questions
router.post("/questions", authMiddleware, adminOnly, async (req, res) => {
  const { quizId, questionText } = req.body;

  if (!quizId || !questionText) {
    return res.status(400).json({ error: "quizId and questionText are required" });
  }

  try {
    // Check if quiz exists
    const [quizRows] = await db.execute("SELECT id FROM quizzes WHERE module_id = ?", [quizId]);
    let realQuizId;

    if (quizRows.length === 0) {
      // Auto-create quiz
      const [inserted] = await db.execute("INSERT INTO quizzes (module_id) VALUES (?)", [quizId]);
      realQuizId = inserted.insertId;
    } else {
      realQuizId = quizRows[0].id;
    }

    // Now insert the question
    const [questionRes] = await db.execute(
      "INSERT INTO quiz_questions (quiz_id, question_text) VALUES (?, ?)",
      [realQuizId, questionText]
    );

    res.status(201).json({ message: "Question added", id: questionRes.insertId });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ error: "Failed to add question" });
  }
});

//  3. Update a question
router.put("/questions/:id", authMiddleware, adminOnly, async (req, res) => {
  const { questionText } = req.body;

  if (!questionText) return res.status(400).json({ error: "questionText is required" });

  try {
    await db.execute(
      "UPDATE quiz_questions SET question_text = ? WHERE id = ?",
      [questionText, req.params.id]
    );
    res.json({ message: "Question updated" });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ error: "Failed to update question" });
  }
});

//  4. Delete a question (and options)
router.delete("/questions/:id", authMiddleware, adminOnly, async (req, res) => {
  const questionId = req.params.id;

  try {
    await db.execute("DELETE FROM quiz_options WHERE question_id = ?", [questionId]);
    await db.execute("DELETE FROM quiz_questions WHERE id = ?", [questionId]);
    res.json({ message: "Question and options deleted" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

//  5. Add an option to a question
router.post("/options", authMiddleware, adminOnly, async (req, res) => {
  const { questionId, optionText, isCorrect } = req.body;

  if (!questionId || !optionText) {
    return res.status(400).json({ error: "questionId and optionText are required" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
      [questionId, optionText, isCorrect ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, message: "Option added" });
  } catch (err) {
    console.error("Error adding option:", err);
    res.status(500).json({ error: "Failed to add option" });
  }
});

//  6. Update an option
router.put("/options/:id", authMiddleware, adminOnly, async (req, res) => {
  const { optionText, isCorrect } = req.body;

  if (!optionText) return res.status(400).json({ error: "optionText is required" });

  try {
    await db.execute(
      "UPDATE quiz_options SET option_text = ?, is_correct = ? WHERE id = ?",
      [optionText, isCorrect ? 1 : 0, req.params.id]
    );
    res.json({ message: "Option updated" });
  } catch (err) {
    console.error("Error updating option:", err);
    res.status(500).json({ error: "Failed to update option" });
  }
});

//  7. Delete an option
router.delete("/options/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await db.execute("DELETE FROM quiz_options WHERE id = ?", [req.params.id]);
    res.json({ message: "Option deleted" });
  } catch (err) {
    console.error("Error deleting option:", err);
    res.status(500).json({ error: "Failed to delete option" });
  }
});

router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, email, created_at FROM users ORDER BY created_at DESC");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
