const db = require("../config/db");

const getUserProfile = async (req, res) => {
    const userId = req.user.id;


    try{
        const[rows] = await db.execute('SELECT email FROM users WHERE id = ?', [userId]);

        if(!rows.length) return res.status(404).json({ error: "User Not Found" });


        res.json({
            email: rows[0].email
        });
    }catch (err){
        console.error(err);
        res.status(500).json({ error: "Server Error "});
    }
};


module.exports = { getUserProfile };