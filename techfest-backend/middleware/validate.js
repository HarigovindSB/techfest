const { validationResult } = require("express-validator");

// Run after a chain of express-validator checks: 400 + first message
module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ message: result.array()[0].msg });
  }
  next();
};
