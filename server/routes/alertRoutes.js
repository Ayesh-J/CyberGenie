const express = require('express');
const router = express.Router();
const db = require("../config/db");

router.get("/alerts", async (req, res) => {
    try{
        const [rows] = await db.execute('SELECT title FROM cyber_alerts ORDER BY RAND() LIMIT 5');
        res.json(rows);
    }catch(err){
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;