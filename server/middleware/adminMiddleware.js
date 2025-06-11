module.exports = function (req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next(); // allow access
  } else {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
};
