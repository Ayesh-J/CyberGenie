const express = require('express');
const router = express.Router();
const db = require("../config/db");

// making a GET /api/didyouknow/random

router.get('/random', async (req, res) => {
    try{
        const [rows] = await db.query("SELECT * FROM cyber_facts ORDER BY RAND() LIMIT 1");
    if(rows.length === 0){
        return res.status(404).json({error: "No Facts Found"});
    }
    res.json({ fact: rows[0].fact});
    }catch(err){
        console.error("Error Fetching Fact", err );
        res.status(500).json({error: "Failed to Fetch"})
    };
});

module.exports = router;