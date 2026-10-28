const express = require("express");
const { body } = require("express-validator");
const Feedback = require("../models/Feedback");
const validate = require("../middleware/validate");

const router = express.Router();

// GET /api/feedback -> latest 20 (public). Text is returned as-is; the
// React page renders it as plain text, so <script> never executes.
router.get("/", async (req, res, next) => {
  try {
    res.json(await Feedback.find().sort({ createdAt: -1 }).limit(20));
  } catch (err) {
    next(err);
  }
});

// POST /api/feedback
router.post(
  "/",
  body("name").isString().trim().notEmpty().withMessage("Name is required").isLength({ max: 60 }),
  body("message").isString().trim().notEmpty().withMessage("Message is required").isLength({ max: 500 }),
  validate,
  async (req, res, next) => {
    try {
      const { name, message } = req.body;
      const fb = await Feedback.create({ name, message });
      res.status(201).json(fb);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
