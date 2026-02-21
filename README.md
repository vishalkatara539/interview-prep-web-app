# InterviewPrep Pro

A full-stack interview preparation web application with quiz functionality, progress tracking, and admin controls.

## Features
- User Registration & Login
- Quiz Categories: JavaScript, React, Node.js, HTML/CSS, SQL, General Programming
- Timed Quiz System (30 seconds per question)
- Progress Tracking & History
- Admin Panel for managing users and questions

## How to Run

### 1. Install Dependencies
```
bash
npm install
```

### 2. Start the Server
```
bash
node server.js
```

### 3. Open in Browser
Go to: http://localhost:3000

## Login Credentials
- **Admin:** admin@interviewprep.com / admin123
- **New User:** Register a new account

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite (better-sqlite3)
- Authentication: JWT, bcrypt

## API Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/quiz/categories - Get quiz categories
- GET /api/quiz/:category - Get questions
- POST /api/quiz/:category/submit - Submit quiz
- GET /api/user/progress - Get user progress
- GET /api/admin/users - Get all users (admin only)
- GET /api/admin/questions - Get all questions (admin only)
