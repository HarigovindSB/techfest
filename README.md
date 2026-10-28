# TechFest 2026 Portal

Full-stack web application for TechFest 2026 event registration and management.

- **Frontend**: React + Vite (Configured for deployment on **Netlify**)
- **Backend**: Node.js + Express REST API (Configured for deployment on **Render**)
- **Database**: **MongoDB Atlas** cloud database

---

## Project Structure

```text
├── netlify.toml              # Netlify build and redirect configuration
├── render.yaml               # Render Blueprint configuration for backend service
├── .gitignore                # Root gitignore excluding node_modules, build artifacts, env files
├── techfest-backend/         # Express REST API
│   ├── models/               # Mongoose schemas (User, Event, Registration)
│   ├── routes/               # API routes (auth, events, registrations)
│   ├── middleware/           # Auth, logging, error handling
│   ├── seed.js               # Database seeding script (initial events & admin)
│   ├── server.js             # Server entry point
│   ├── .env.example          # Sample environment variables
│   └── package.json
└── techfest-frontend/        # React + Vite client
    ├── public/               # Public assets and _redirects for Netlify SPA routing
    ├── src/                  # React source (pages, components, context, api)
    ├── netlify.toml          # Frontend Netlify config
    ├── .env.example          # Sample environment variables
    ├── vite.config.js
    └── package.json
```

---

## 1. Database Setup: MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (e.g. `Cluster0`).
3. Under **Security > Database Access**:
   - Add a database user with password authentication (e.g., username `admin`, strong password).
4. Under **Security > Network Access**:
   - Click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render's cloud servers can connect.
5. Under **Database > Deployment > Connect**:
   - Choose **Connect your application** -> Driver: **Node.js**.
   - Copy the connection URI:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/techfest?retryWrites=true&w=majority
     ```
   - Replace `<username>`, `<password>`, and ensure the database name is `techfest`.

---

## 2. Backend Deployment: Render

1. Log in to [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/HarigovindSB/techfest.git`.
4. Configure the Web Service:
   - **Name**: `techfest-backend`
   - **Root Directory**: `techfest-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string from Step 1.
   - `JWT_SECRET`: A secure random string (e.g., `supersecretkey_techfest2026`).
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g., `https://techfest-backend.onrender.com`).
   - You can verify it by opening `https://techfest-backend.onrender.com/` in your browser. It should return: `{"message":"TechFest API is running"}`.

*(Optional)* **Seed Database with Default Events and Admin**:
To seed initial events into your MongoDB Atlas database, run locally from `techfest-backend` with your Atlas `MONGO_URI`:
```bash
cd techfest-backend
MONGO_URI="your_mongodb_atlas_connection_string" npm run seed
```

---

## 3. Frontend Deployment: Netlify

1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** > **Import an existing project** > **GitHub**.
3. Select your repository: `HarigovindSB/techfest`.
4. The deployment settings will auto-detect from `netlify.toml`:
   - **Base directory**: `techfest-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (or `techfest-frontend/dist` depending on root selection)
5. Under **Environment variables**, click **Add a variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<your-render-backend-name>.onrender.com/api` *(Make sure to include `/api`)*
6. Click **Deploy techfest**.
7. Netlify will build and deploy your frontend. Client-side routing is handled by `_redirects` and `netlify.toml`.

---

## 4. Local Development

### Backend
```bash
cd techfest-backend
npm install
npm run dev
```
Runs on `http://localhost:5000`.

### Frontend
```bash
cd techfest-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.
