process.env.JWT_SECRET = "test-secret";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

const token = (role) => jwt.sign({ id: "64b000000000000000000001", role }, "test-secret");

describe("TechFest API (no database needed)", () => {
  test("GET / reports the API is running", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("TechFest API is running");
  });

  test("sends Helmet security headers", async () => {
    const res = await request(app).get("/");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["content-security-policy"]).toBeDefined();
  });

  test("unknown route -> 404 JSON", async () => {
    const res = await request(app).get("/nope");
    expect(res.status).toBe(404);
  });

  test("POST /api/events without token -> 401", async () => {
    const res = await request(app).post("/api/events").send({});
    expect(res.status).toBe(401);
  });

  test("POST /api/events with student token -> 403", async () => {
    const res = await request(app).post("/api/events").set("Authorization", "Bearer " + token("student")).send({});
    expect(res.status).toBe(403);
  });

  test("admin with invalid body -> 400", async () => {
    const res = await request(app).post("/api/events").set("Authorization", "Bearer " + token("admin")).send({ name: "" });
    expect(res.status).toBe(400);
  });

  test("NoSQL injection in login is rejected", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });

  test("register with weak input -> 400", async () => {
    const res = await request(app).post("/api/auth/register").send({ name: "A", email: "bad", password: "1" });
    expect(res.status).toBe(400);
  });

  test("registration needs a login", async () => {
    const res = await request(app).post("/api/registrations").send({ eventId: "x" });
    expect(res.status).toBe(401);
  });
});
