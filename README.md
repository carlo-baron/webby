# 🕸️ Webby

A beginner-friendly Express.js backend template with authentication, user CRUD, caching, and rate limiting — ready to build on.

---

## ✨ Features

- 🔐 **Authentication** — Register, login, logout with JWT (access + refresh tokens) stored in HTTP-only cookies
- 👤 **User CRUD** — Create, read, update, delete users out of the box
- 🛡️ **RBAC** — Role-based access control with `admin` and `user` roles
- ⚡ **Caching** — Redis-powered caching via ioredis
- 🚦 **Rate Limiting** — Protect routes from abuse using rate-limiter-flexible
- 🔑 **Google Sign-In** — OAuth2 login via Google Identity Services
- 🌐 **CORS + Helmet** — Security headers configured out of the box
- 🏷️ **TypeScript** — Fully typed codebase

---

## 🛠️ Tech Stack

| Tool               | Purpose                 |
| ------------------ | ----------------------- |
| Express            | Web framework           |
| MongoDB + Mongoose | Database                |
| Redis + ioredis    | Caching & rate limiting |
| TypeScript         | Type safety             |
| bcryptjs           | Password hashing        |
| jsonwebtoken       | JWT auth                |
| Zod                | Schema validation       |

---

## 📁 Project Structure

```
src/
├── config/         # DB and Redis connection
├── controllers/    # Route handlers
├── middlewares/    # Auth, RBAC, rate limiting
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── scripts/        # Utility scripts
├── service/        # Used services (e.g. email service)
├── types/          # TypeScript types
├── utils/          # Helper functions
├── lib/            # App specific functions
├── validators/     # Zod schemas for validation
└── index.ts        # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or via Docker
- [Redis](https://redis.io/) installed locally (started automatically via `npm run dev`)

### 1. Clone the repo

```bash
git clone https://github.com/carlo-baron/webby.git
cd webby
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env` (see [Environment Variables](#-environment-variables) below).

### 4. Start MongoDB

```bash
# Using Docker (recommended)
docker run -d --name mongodb --restart unless-stopped -p 27017:27017 mongo:latest

# Or via systemctl (Linux)
sudo systemctl start mongodb
```

### 5. Run the dev server

```bash
npm run dev
```

Redis is started automatically. The server will be available at `http://localhost:5000`.

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
APP_MODE=development

FRONTEND_URL=http://localhost:3000

# Generate a strong secret using:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=

# MongoDB
MONGO_URI=your_production_mongodb_uri
MONGO_URI_LOCAL=mongodb://localhost:27017/myapp_local

# Google OAuth (Web Client ID)
WEB_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Redis
REDIS_URL=redis://localhost:6379
```

---

## 📡 API Routes

### Auth

| Method | Route                | Description                   |
| ------ | -------------------- | ----------------------------- |
| GET    | `/api/auth`          | Check if auth route is alive  |
| POST   | `/api/auth/register` | Register a new user           |
| POST   | `/api/auth/login`    | Login with email + password   |
| POST   | `/api/auth/logout`   | Logout and clear cookies      |
| POST   | `/api/auth/google`   | Login or register with Google |
| POST   | `/api/auth/refresh`  | Refresh access token          |

### Users

| Method | Route            | Description    | Role         |
| ------ | ---------------- | -------------- | ------------ |
| GET    | `/api/users`     | Get all users  | Admin        |
| GET    | `/api/users/:id` | Get user by ID | Admin, Owner |
| PATCH  | `/api/users/:id` | Update user    | Admin, Owner |
| DELETE | `/api/users/:id` | Delete user    | Admin, Owner |

---

## 📜 Scripts

```bash
npm run dev       # Start dev server with watch mode (includes Redis)
npm run build     # Compile TypeScript
npm run start     # Run compiled app
npm run prod      # Run in production mode (set APP_MODE=production in .env first)
```

---

## 📝 License

MIT
