const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const saltRounds = 10;
const secret = process.env.JWT_SECRET; // Make sure this is set in your .env

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: users[0].id, email: users[0].email },
      secret,
      { expiresIn: '1h' }
    );

    res.json({
      user: { id: users[0].id, email: users[0].email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  // Since JWT is stateless, logout is handled client-side by deleting token
  res.json({ message: 'Logout successful (client should delete token)' });
};

exports.status = (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, user: { id: req.user.id, email: req.user.email } });
  } else {
    res.json({ loggedIn: false, user: null });
  }
};
