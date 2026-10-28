const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
