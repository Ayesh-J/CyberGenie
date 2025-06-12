const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure env vars are loaded

const secret = process.env.JWT_SECRET;
 

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    console.error(" JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
