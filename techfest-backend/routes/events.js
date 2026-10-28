const express = require("express");
const Event = require("../models/Event");
const { body } = require("express-validator");
const { auth, adminOnly } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const eventRules = [
  body("name").isString().trim().notEmpty().withMessage("Name is required"),
  body("category").isString().trim().notEmpty().withMessage("Category is required"),
  body("fee").isFloat({ min: 0 }).withMessage("Fee must be 0 or more"),
  body("seats").isInt({ min: 0 }).withMessage("Seats must be 0 or more"),
  body("date").isISO8601().withMessage("Enter a valid date"),
  body("description").optional().isString().isLength({ max: 300 }),
];

// only these fields can be written (blocks mass-assignment)
const pick = ({ name, category, fee, seats, date, description }) => ({
  name, category, fee, seats, date, description,
});

// GET /api/events -> all events
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id -> one event
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// POST /api/events -> add an event (admin)
router.post("/", auth, adminOnly, eventRules, validate, async (req, res, next) => {
  try {
    const event = await Event.create(pick(req.body));
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

// PUT /api/events/:id -> edit an event (admin)
router.put("/:id", auth, adminOnly, eventRules, validate, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id -> remove an event (admin)
router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
