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

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // <-- Add this line
      },
      secret,
      { expiresIn: '1h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // <-- Also send it in response if needed on frontend
      },
      token,
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
