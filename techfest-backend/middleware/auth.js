const jwt = require("jsonwebtoken");

// Middleware 1: is there a valid token?  (401 if not)
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please login first" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role, iat, exp }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Middleware 2: is the logged-in user an admin?  (403 if not)
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

module.exports = { auth, adminOnly };
