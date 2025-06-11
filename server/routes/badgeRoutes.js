const router = require("./authRoutes");

router.get('/user/:userId/badges', async (req, res) => {
  const { userId } = req.params;
  try {
    const [badges] = await db.query(`
      SELECT b.id, b.name, b.description, b.image_url, ub.awarded_at
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ?
    `, [userId]);

    res.json({ badges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;