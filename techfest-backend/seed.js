// Optional helper:  npm run seed
// Adds the four Experiment-3 events and one admin account so you can test
// quickly. Run it once (it skips anything that already exists).
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Event = require("./models/Event");
const User = require("./models/User");

const events = [
  { name: "Code Sprint", category: "Coding", fee: 200, seats: 5, date: "2026-09-11", description: "Competitive programming challenge." },
  { name: "Robo Wars", category: "Robotics", fee: 300, seats: 8, date: "2026-09-11", description: "Build and battle autonomous robots." },
  { name: "UI/UX Challenge", category: "Design", fee: 150, seats: 10, date: "2026-09-12", description: "Design an innovative user interface." },
  { name: "AI Hackathon", category: "AI", fee: 250, seats: 6, date: "2026-09-12", description: "Create solutions using artificial intelligence." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const e of events) {
    const exists = await Event.findOne({ name: e.name });
    if (!exists) await Event.create(e);
  }

  const adminEmail = "admin@techfest.com";
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });
  }

  console.log("Seed done.  Admin login: admin@techfest.com / admin123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.log("Seed error:", err.message);
  process.exit(1);
});
