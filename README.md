
# CyberGenie – Cybersecurity Awareness Platform

CyberGenie is an educational web platform designed to promote cybersecurity awareness through interactive modules, quizzes, gamified rewards, and a supportive chatbot interface. Built using the MERN-like stack (React, Node, MySQL), it offers users a fun and guided learning experience in digital safety.

## Live Demo

- Frontend: https://cyber-genie.vercel.app
- Backend: Hosted on Railway (internal use only)

## Features

- JWT-based secure authentication
- LearnZone with interactive module tracking
- Quiz system with scoring and rewards
- Rule-based CyberGenie chatbot
- Badge and certificate generation
- Dynamic dashboard with tips and alerts
- Admin panel to manage users and content

## Tech Stack

| Layer       | Technology Used            |
|------------|-----------------------------|
| Frontend   | React.js, Tailwind CSS      |
| Backend    | Node.js, Express.js         |
| Database   | MySQL                       |
| Auth       | JSON Web Tokens (JWT)       |
| Hosting    | Vercel (Frontend), Railway (Backend) |

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/cybergenie.git
cd cybergenie
```

### 2. Set Up Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=cybergenie
NODE_ENV=development
```

Then start the backend:

```bash
npm start
```

### 3. Set Up Frontend

```bash
cd ../client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=https://cybergenie-backend-production.up.railway.app/api
```

Start the frontend:

```bash
npm run dev
```

## Project Structure

```
cybergenie/
├── client/                 # React Frontend
│   └── src/
├── server/                 # Node.js Backend
│   └── routes/             # API route handlers
│   └── controllers/
│   └── config/
├── public/                 # Badge & static files
```

## API Endpoints (Sample)

| Method | Endpoint                    | Purpose                        |
|--------|-----------------------------|--------------------------------|
| GET    | /api/learnzone              | Fetch learning modules         |
| POST   | /api/auth/register          | Register a user                |
| POST   | /api/auth/login             | Login and return JWT token     |
| GET    | /api/progress               | Get user's module progress     |
| GET    | /api/quiz/:moduleId         | Get quiz questions             |
| POST   | /api/quiz/submit            | Submit quiz answers            |
| GET    | /api/badge                  | Fetch earned badges            |

## Admin Features

- View all registered users
- Track platform-wide usage statistics
- Manage learning resources (CRUD support)

## Gamification

- Badges: Automatically awarded for completing modules or scoring high on quizzes.
- Certificates: Generated upon full course completion.

## License

This project is intended for educational purposes and academic demonstration. For other use cases, please contact the maintainers.

## Authors

- Ayesh Mehmood Jamadar

