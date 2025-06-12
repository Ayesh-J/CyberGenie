const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

router.get("/certificates/download", authMiddleware, async (req, res) => {
    try {
        const filePath = path.join(__dirname, "../assets/certificate.pdf");
        const existingPdfBytes = fs.readFileSync(filePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const emailText = req.user.email;

        firstPage.drawText(req.user.email, {
            x: 190,  // moved left from 145 → 118
            y: 170,  // raised up slightly from 148 → 152
            size: 8,
            font,
            color: rgb(0.1, 0.8, 0.9),
        });

        const pdfBytes = await pdfDoc.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=CyberGenie_Certificate.pdf");
        res.send(pdfBytes);
    } catch (err) {
        console.error("Certificate Generation Failed:", err);
        res.status(500).json({ error: "Could Not Generate Certificate" });
    }
});

router.get("/certificates/status", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [modules] = await db.execute(
      "SELECT COUNT(*) AS total FROM learning_modules"
    );
    const [completed] = await db.execute(
      "SELECT COUNT(*) AS completed FROM user_progress WHERE user_id = ? AND is_completed = 1",
      [userId]
    );

    const [quizCount] = await db.execute(
      "SELECT COUNT(*) AS total FROM quizzes"
    );
    const [quizCompleted] = await db.execute(
      "SELECT COUNT(DISTINCT quiz_id) AS completed FROM quiz_results WHERE user_id = ? AND score >= 5",
      [userId]
    );

    const moduleDone = completed[0].completed >= modules[0].total;
    const quizDone = quizCompleted[0].completed >= quizCount[0].total;

    res.json({ eligible: moduleDone && quizDone });
  } catch (err) {
    console.error("Certificate eligibility check failed:", err);
    res.status(500).json({ error: "Unable to check eligibility" });
  }
});

module.exports = router;
