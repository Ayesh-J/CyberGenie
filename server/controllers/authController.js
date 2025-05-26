const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP CONTROLLER
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// LOGIN CONTROLLER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user[0].id,
        email: user[0].email
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
