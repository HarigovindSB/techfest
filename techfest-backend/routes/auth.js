const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const User = require("../models/User");
const validate = require("../middleware/validate");

const router = express.Router();

// Exp 5: httpOnly (JS cannot read it), secure (HTTPS only in production),
// sameSite (cross-site Netlify -> Render needs "none" + secure)
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 60 * 60 * 1000,
};

// POST /api/auth/register
router.post(
  "/register",
  body("name").isString().trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters"),
  body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").isString().isLength({ min: 6, max: 72 }).withMessage("Password must be 6-72 characters"),
  validate,
  async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already used" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password is required"),
  validate,
  async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, cookieOptions);
    res.json({ token, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
  }
);

// POST /api/auth/logout -> clear the cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
});

module.exports = router;
