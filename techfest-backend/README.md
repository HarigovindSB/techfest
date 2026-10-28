# TechFest 2026 – Backend (Experiment 4)

## Run
1. Start MongoDB (check in Compass: mongodb://127.0.0.1:27017)
2. `npm install`
3. `npm run seed`   (optional: adds the 4 events + admin@techfest.com / admin123)
4. `node server.js`  -> "Server running on port 5000" / "MongoDB connected"

React: in `techfest-react` run `npm install` then `npm run dev` (http://localhost:5173).

## API endpoints
| Method | Route | Purpose | Access | Status codes |
|---|---|---|---|---|
| POST | /api/auth/register | Create an account | Public | 201, 400 |
| POST | /api/auth/login | Log in, receive a JWT | Public | 200, 401 |
| GET | /api/events | List all events | Public | 200 |
| GET | /api/events/:id | Get one event | Public | 200, 400, 404 |
| POST | /api/events | Add an event | Admin | 201, 400, 401, 403 |
| PUT | /api/events/:id | Edit an event | Admin | 200, 400, 401, 403, 404 |
| DELETE | /api/events/:id | Remove an event | Admin | 200, 401, 403, 404 |
| POST | /api/registrations | Register for an event | Logged in | 201, 400, 401, 404 |
| GET | /api/registrations/my | View my registrations | Logged in | 200, 401 |

## Postman checks (screenshots for the record)
- POST /api/events, no header -> 401 Please login first
- POST /api/events, student token -> 403 Admins only
- POST /api/events, admin token -> 201
- POST /api/events without name -> 400 (validation message)
- GET /api/events/123 -> 400 Invalid id
- GET /api/nothing -> 404 Route not found
Header format: `Authorization: Bearer <token>` (note the space)
