// routes/chatbot.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/node/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM chatbot_nodes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Node not found" });
    }

    const node = rows[0];
    node.options = JSON.parse(node.options || "[]");

    res.json(node);
  } catch (err) {
    console.error("Failed to fetch chatbot node:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
