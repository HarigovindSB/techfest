const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");

const logger = require("./middleware/logger");
const errors = require("./middleware/errorHandler");

const app = express();

// Exp 5: security headers (CSP, X-Content-Type-Options, HSTS ...)
app.use(helmet());

// Allow only the React site (set CLIENT_URL on Render); open in local dev
const allowed = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean);
app.use(
  cors({
    origin: allowed.length ? allowed : true,
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));

// Exp 5: strip $ and . keys (NoSQL injection). Express 5 makes req.query
// read-only, so sanitize in place instead of app.use(mongoSanitize()).
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(req.query);
  next();
});

app.use(logger);

app.get("/", (req, res) => {
  res.json({ message: "TechFest API is running" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/feedback", require("./routes/feedback"));

app.use(errors.notFound);
app.use(errors.errorHandler);

module.exports = app;
